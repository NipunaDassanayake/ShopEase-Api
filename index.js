import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use((req, res, next) => {
  let token = req.header("Authorization");

  if (token != null) {
    token = token.replace("Bearer ", "");

    jwt.verify(token, "nt-secret-89!", (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
      }
    });
  }
  next(); // pass the execution to the next middleware function
});

const mongoUrl =
  "mongodb+srv://admin:123@cluster0.f3w4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoUrl);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB conection established successfully");
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
