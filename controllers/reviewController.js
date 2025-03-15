import Review from "../models/review.js";
import { checkLogin } from "./userController.js";

export async function createReview(req, res) {
  checkLogin(req);

  try {
    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName; // adding user name to the review
    data.profilePicture = req.user.profilePicture; // adding user profile picture to the review
    data.email = req.user.email; // adding user email to the review

    const newReview = new Review(data);
    await newReview.save();
    res.json({ message: "Review created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Review creation failed", error });
  }

  // const data = req.body;

  // data.name = req.user.firstName + " " + req.user.lastName; // adding user name to the review
  // data.profilePicture = req.user.profilePicture; // adding user profile picture to the review
  // data.email = req.user.email; // adding user email to the review

  // const newReview = new Review(data);
  // newReview
  //   .save()
  //   .then(() => {
  //     res.json({ message: "Review created successfully" });
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ message: "Review creation failed", error });
  //   });
}

export async function getAllReviews(req, res) {
  const user = req.user;
  console.log(user);

  try {
    if (!user || user.role != "admin") {
      const reviews = await Review.find({ isApproved: true });
      res.json({ reviews });
    } else {
      const reviews = await Review.find();
      res.json({ reviews });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to retrive reviews", error });
  }
}

// // if (!user || user.role != "admin") {
// //   Review.find({ isApproved: true })
// //     .then((reviews) => {
// //       res.json({ reviews });
// //     })
// //     .catch((error) => {
// //       res.status(500).json({ message: "failed to retrive reviews", error });
// //     });
// // } else {
// //   Review.find()
// //     .then((reviews) => {
// //       res.json({ reviews });
// //     })
// //     .catch((error) => {
// //       res.status(500).json({ message: "failed to retrive reviews", error });
// //     });
// }

export async function getReviewById(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }
  const id = req.params.id;
  const user = req.user;
  console.log(user);
  try {
    if (!user || user.role != "admin") {
      const review = await Review.findById(id).where({ isApproved: true });
      res.json({ review });
    } else {
      const review = await Review.findById(id);
      res.json({ review });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to retrive review", error });
  }

  // if (req.user == null) {
  //   res.status(401).json({ message: "please login and try again" });
  //   return;
  // }
  // const id = req.params.id;
  // Review.findById(id)
  //   .then((review) => {
  //     res.json({ review });
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ message: "failed to retrive review", error });
  //   });
}

export async function deleteReview(req, res) {
  checkLogin(req);

  try {
    const id = req.params.id;
    if (req.user.id !== id && req.user.role !== "admin") {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this review" });
      return;
    } else {
      await Review.findByIdAndDelete(id);
      res.json({ message: "Review deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Review deletion failed", error });
  }

  // const id = req.params.id;
  // if (req.user.id != id && req.user.role != "admin") {
  //   res
  //     .status(401)
  //     .json({ message: "You are not authorized to delete this review" });
  //   return;
  // } else {
  //   Review.findByIdAndDelete(id)
  //     .then(() => {
  //       res.json({ message: "Review deleted successfully" });
  //     })
  //     .catch((error) => {
  //       res.status(500).json({ message: "Review deletion failed", error });
  //     });
}

export async function approveReview(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }

  try {
    const id = req.params.id;
    if (req.user.role !== "admin") {
      res
        .status(401)
        .json({ message: "You are not authorized to approve this review" });
      return;
    } else {
      await Review.findByIdAndUpdate(id, { isApproved: true }); // setting isApproved to true
      res.json({ message: "Review approved successfully", id });
    }
  } catch (error) {
    res.status(500).json({ message: "Review approval failed", error });
  }
}

export async function rejectReview(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }

  try {
    const id = req.params.id;
    if (req.user.role !== "admin") {
      res
        .status(401)
        .json({ message: "You are not authorized to reject this review" });
      return;
    } else {
      await Review.findByIdAndUpdate(id);
      res.json({ message: "Review rejected successfully", id });
    }
  } catch (error) {
    res.status(500).json({ message: "Review rejection failed", error });
  }
}
