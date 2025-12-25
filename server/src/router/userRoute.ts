import { Router } from "express";
import {
  meController,
  refreshTokenController,
  signInController,
  signOutController,
  signUpController,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router: Router = Router();

router.use("/signup", signUpController);
router.use("/signin", signInController);
// TODO : necessay to authenticate
router.use("/signout", authMiddleware, signOutController);
router.use("/me", authMiddleware, meController);
router.use("/refreshToken", refreshTokenController);

export default router;
