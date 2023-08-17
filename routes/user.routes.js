import express from "express";
import {
  getSignInPage,
  signInUser,
  logoutUser,
  generateOTP,
  getOTPSecret,
  getVerifyTokenPage,
  verifyToken,
  getUserConfigurationPage,
  activateToken
} from "../controllers/user.controllers.js";
import { isAuth, isAuthRequireToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSignInPage);

router.post("/", signInUser);

router.get("/verifyToken", isAuthRequireToken, getVerifyTokenPage);

router.post("/verifyToken", isAuthRequireToken, verifyToken);

router.get("/generateOTP", isAuth, generateOTP);

router.post("/activateOTP", isAuth, activateToken);

router.get("/user/configuration", isAuth, getUserConfigurationPage);

router.get("/logout", isAuth, logoutUser);

//TOGGLE FEATURE FOR SIGNUP
// router.post("/sign-up", signUpUser);

export default router;
