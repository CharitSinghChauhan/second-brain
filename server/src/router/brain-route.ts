import { Router } from "express";
import {
  changeVisibilityController,
  generateOrGetShareableLinkController,
  getAllContentFromBrain,
} from "../controllers/brain-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router: Router = Router();

router.get("/:id/share", getAllContentFromBrain);
router.post("/", authMiddleware, changeVisibilityController);
router.get("/", authMiddleware, generateOrGetShareableLinkController);

export default router;
