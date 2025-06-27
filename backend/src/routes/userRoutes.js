import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const userRouter = express.Router();

userRouter.get("/:id", authMiddleware, getUser);
userRouter.put("/:id", authMiddleware, updateUser);

export default userRouter;