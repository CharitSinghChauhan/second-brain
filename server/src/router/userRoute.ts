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

router.use("/auth/signup", signUpController);
router.use("/auth/signin", signInController);
// TODO : necessay to authenticate
router.use("/auth/signout", authMiddleware, signOutController);
router.use("/auth/me", authMiddleware, meController)
router.use("/auth/refreshToken", refreshTokenController)

export default router;
