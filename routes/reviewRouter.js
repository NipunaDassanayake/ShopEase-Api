import express from "express";

import {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
  approveReview,
  rejectReview
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getReviewById);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.patch("/:id/approve", approveReview);
reviewRouter.patch("/:id/reject", rejectReview);

export default reviewRouter;
