import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { renderSignInPage } from "../utils/renderPage.utils.js";
import { incorrectCredentials } from "../utils/statusHandler.utils.js";

const viewVariables = {
  status: null,
  message: "",
};

export const getSignInPage = (req, res) => {
  if (!req.session.auth) {
    renderSignInPage(res, viewVariables);
  }

  res.redirect("/invoice");
};

export const signInUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ user: username });

    if (!user) {
      renderSignInPage(res, incorrectCredentials);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      renderSignInPage(res, incorrectCredentials);
    }

    req.session.username = username;
    req.session.auth = true;

    res.redirect("/invoice");
  } catch (error) {
    console.log(error.message);
    renderSignInPage(res, incorrectCredentials);
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// TOGGLE FEATURE SIGN UP USERS
// export const signUpUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const salt = await bcrypt.genSalt();

//     const passwordHash = await bcrypt.hash(password, salt);

//     const user = new User({ user: username, password: passwordHash });

//     await user.save();

//     res.status(201).json({});
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };
