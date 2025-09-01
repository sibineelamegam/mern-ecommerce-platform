import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";

// Controllers
import getAllUsers from "../controllers/user/getAllUsers.js";
import getUserById from "../controllers/user/getUserById.js";
import updateUser from "../controllers/user/updateUser.js";
import deleteUser from "../controllers/user/deleteUser.js";
import getProfile from "../controllers/user/getProfile.js";
import updateProfile from "../controllers/user/updateProfile.js";
import createUser from "../controllers/user/createUser.js";

const router = express.Router();

//  Apply verifyJWT once for all routes
router.use(verifyJWT);

// Logged-in user routes
router.get("/profile/me", getProfile);
router.put("/profile/me", updateProfile);

// Admin-only routes
router.post("/", requireRole("admin"), createUser);
router.get("/", requireRole("admin"), getAllUsers);
router.get("/:id", requireRole("admin"), getUserById);
router.put("/:id", requireRole("admin"), updateUser);
router.delete("/:id", requireRole("admin"), deleteUser);

export default router;
