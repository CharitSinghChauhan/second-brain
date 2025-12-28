import { Router } from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createContentController,
  deleteContentController,
  editContentController,
  getAllContentController,
} from "../controllers/content-controller.js";

const router: Router = Router();

router.post("/", authMiddleware, createContentController);
router.get("/", authMiddleware, getAllContentController);
router.delete("/:id", authMiddleware, deleteContentController);
router.put("/:id", authMiddleware, editContentController);


export default router;
