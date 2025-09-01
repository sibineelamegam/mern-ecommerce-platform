import express from "express";

// Controllers
import registerController from "../controllers/auth/register.js";
import loginController from "../controllers/auth/login.js";
import logoutController from "../controllers/auth/logout.js";
import refreshTokenController from "../controllers/auth/refreshToken.js";
import forgotPasswordController from "../controllers/auth/forgotPassword.js";
import resetPasswordController from "../controllers/auth/resetPassword.js";

const router = express.Router();

// Auth routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/refresh", refreshTokenController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
