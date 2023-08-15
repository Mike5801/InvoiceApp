import express from "express";
import { getSignInPage, signInUser, logoutUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/", getSignInPage);

//TOGGLE FEATURE FOR SIGNUP
// router.post("/sign-up", signUpUser);

router.post("/", signInUser);

router.get("/logout", logoutUser);

export default router;
