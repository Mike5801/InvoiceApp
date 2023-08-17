import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  renderSignInPage,
  renderVerifyTokenPage,
} from "../utils/renderPage.utils.js";
import {
  incorrectCredentials,
  incorrectToken,
} from "../utils/statusHandler.utils.js";
import * as OTPAuth from "otpauth";
import crypto from "crypto";
import pkg from "hi-base32";
const { encode } = pkg;

const viewVariables = {
  status: null,
  message: "",
};

const totpOptions = {
  issuer: process.env.TOKEN_ISSUER,
  label: process.env.TOKEN_LABEL,
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: "",
};

export const getSignInPage = (req, res) => {
  if (!req.session.auth || !req.session.tokenVerified) {
    req.session.destroy();
    renderSignInPage(res, viewVariables);
    return;
  }

  res.redirect("/invoice");
};

export const signInUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ user: username });

    if (!user) {
      renderSignInPage(res, incorrectCredentials);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      renderSignInPage(res, incorrectCredentials);
      return;
    }

    req.session.username = username;
    req.session.auth = true;

    res.redirect("/invoice");
  } catch (error) {
    console.log(error.message);
    renderSignInPage(res, incorrectCredentials);
    return;
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

export const getVerifyTokenPage = (req, res) => {
  renderVerifyTokenPage(res, viewVariables);
};

export const generateOTP = async (req, res) => {
  try {
    const username = req.session.username;

    const user = await User.findOne({ user: username });

    if (!user) {
      return res.redirect("/");
    }

    const base32Secret = generateRandomBase32();

    totpOptions.secret = base32Secret;

    const totp = new OTPAuth.TOTP(totpOptions);

    const otpAuthUrl = totp.toString();

    await User.findOneAndUpdate(
      { user: username },
      {
        otpAuthUrl: otpAuthUrl,
        otpBase32: base32Secret,
      },
      { new: true }
    );

    res.render("pages/UserConf/index", {
      otpAuthUrl,
      base32Secret,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

export const getOTPSecret = async (req, res) => {
  try {
    const username = req.session.username;

    const user = await User.findOne({ user: username });

    if (!user) {
      return res.redirect("/");
    }

    const otpAuthUrl = user.otpAuthUrl;

    const base32Secret = user.otpBase32;

    res.render("pages/UserConf/index", {
      otpAuthUrl,
      base32Secret,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyToken = async (req, res) => {
  try {
    const username = req.session.username;
    const { token } = req.body;

    const user = await User.findOne({ user: username });

    if (!user) {
      return res.redirect("/");
    }

    totpOptions.secret = user.otpBase32;

    const totp = new OTPAuth.TOTP(totpOptions);

    const delta = totp.validate({ token });

    if (delta === null) {
      renderVerifyTokenPage(res, incorrectToken);
      return;
    }

    const userTokenActivated = user.otpActivated;

    if (!userTokenActivated) {
      await User.findOneAndUpdate(
        { user: username },
        { otpActivated: true },
        { new: true }
      );
    }

    req.session.tokenVerified = true;

    res.redirect("/invoice");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/");
  }
};

export const disableToken = async (req, res) => {
  try {
    const username = req.session.username;

    const user = await User.findOne({ user: username });

    if (!user) {
      return res.redirect("/");
    }

    const isOTPActivated = user.otpActivated;

    if (!isOTPActivated) {
      return res.redirect("/invoice");;
    }

    await User.findOneAndUpdate(
      { user: username },
      { otpActivated: false, otpAuthUrl: "", otpBase32: "" },
      { new: true }
    );

    res.redirect("/invoice");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/");
  }
};

export const signUpUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      user: username,
      password: passwordHash,
      otpAuthUrl: "",
      otpBase32: "",
      otpActivated: false,
    });

    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
