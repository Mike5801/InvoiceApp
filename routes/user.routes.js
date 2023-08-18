import express from "express";
import {
  getSignInPage,
  signInUser,
  signUpUser,
  logoutUser,
  generateOTP,
  getVerifyTokenPage,
  verifyToken,
  getUserConfigurationPage,
  activateToken,
  disableToken
} from "../controllers/user.controllers.js";
import { isAuth, isAuthRequireToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSignInPage);

router.post("/", signInUser);

//TOGGLE FEATURE FOR SIGNUP
// router.post("/sign-up", signUpUser);

router.get("/verifyToken", isAuthRequireToken, getVerifyTokenPage);

router.post("/verifyToken", isAuthRequireToken, verifyToken);

router.get("/generateOTP", isAuth, generateOTP);

router.post("/activateOTP", isAuth, activateToken);

router.get("/disableOTP", isAuth, disableToken);

router.get("/user/configuration", isAuth, getUserConfigurationPage);

router.get("/logout", isAuth, logoutUser);

export default router;
