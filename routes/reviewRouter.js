import express from "express";

import {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getReviewById);
reviewRouter.delete("/:email", deleteReview);

export default reviewRouter;
