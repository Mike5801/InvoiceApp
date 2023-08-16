import User from "../models/user.model.js";

export const isAuthRequireToken = (req, res, next) => {
  const isAuthenticated = req.session.auth;

  if (!isAuthenticated) {
    return res.redirect("/");
  }

  next();
};

export const isAuth = async (req, res, next) => {
  const username = req.session.username;

  const user = await User.findOne({ user: username });

  const hasTokenActivated = user?.otpActivated;
  const isAuthenticated = req.session.auth;
  const tokenVerified = req.session.tokenVerified;

  if (hasTokenActivated && isAuthenticated && !tokenVerified) {
    return res.redirect("/verifyToken");
  }

  if (hasTokenActivated && isAuthenticated && tokenVerified) {
    return next();
  }

  if (!hasTokenActivated && isAuthenticated) {
    return next();
  }

  return res.redirect("/");
};
