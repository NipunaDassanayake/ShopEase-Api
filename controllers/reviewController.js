import Review from "../models/review.js";

export function createReview(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }

  const data = req.body;

  data.name = req.user.firstName + " " + req.user.lastName; // adding user name to the review
  data.profilePicture = req.user.profilePicture; // adding user profile picture to the review
  data.email = req.user.email; // adding user email to the review

  const newReview = new Review(data);
  newReview
    .save()
    .then(() => {
      res.json({ message: "Review created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Review creation failed", error });
    });
}

export function getAllReviews(req, res) {
  const user = req.user;
  console.log(user);

  if (!user || user.role != "admin") {
    Review.find({ isApproved: true })
      .then((reviews) => {
        res.json({ reviews });
      })
      .catch((error) => {
        res.status(500).json({ message: "failed to retrive reviews", error });
      });
  } else {
    Review.find()
      .then((reviews) => {
        res.json({ reviews });
      })
      .catch((error) => {
        res.status(500).json({ message: "failed to retrive reviews", error });
      });
  }
}

export function getReviewById(req, res) {
  const id = req.params.id;
  Review.findById(id)
    .then((review) => {
      res.json({ review });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed to retrive review", error });
    });
}

export function deleteReview(req, res) {
  const email = req.params.email;
  
  if (req.user.email != email && req.user.role != "admin") {
    res.status(401).json({ message: "You are not authorized to delete this review" });
    return;
  }else{
    Review.findOneAndDelete({ email: email })
      .then(() => {
        res.json({ message: "Review deleted successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Review deletion failed", error });
      });
  
}}
