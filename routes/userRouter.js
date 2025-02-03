import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  getUserById,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/users", getAllUsers);

userRouter.get("/:id", getUserById);

export default userRouter;
