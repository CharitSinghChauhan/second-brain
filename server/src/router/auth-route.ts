import { Router } from "express";
import {
  meController,
  refreshTokenController,
  signInController,
  signOutController,
  signUpController,
} from "../controllers/auth-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router: Router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
// TODO : necessay to authenticate
router.get("/signout", authMiddleware, signOutController);
router.get("/me", authMiddleware, meController);
router.get("/refreshToken", refreshTokenController);

export default router;
