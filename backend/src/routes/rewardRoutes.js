import express from "express";
import { createReward, getUserRewards } from "../controllers/rewardController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/reward/:type", authMiddleware, createReward);
router.get("/reward", authMiddleware, getUserRewards);


export default router;
