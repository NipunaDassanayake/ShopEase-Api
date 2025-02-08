import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10); // hashing password using bycrypt

  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.json({ message: "User registered succesfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "User registration failed", error });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({
    email: data.email,
  }).then((user) => {
    if (!user) {
      res.status(404).json({ error: "user not found" });
    } else {
      const isPasswordValid = bcrypt.compareSync(data.password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
          },
          process.env.JWT_SECRET
        );
        res.json({ message: "Login succesfull", token: token });
      } else {
        res.status(401).json({ error: "Login failed" });
      }
    }
  });
}

export function getAllUsers(req, res) {
  User.find()
    .then((users) => {
      res.json({ users });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed to retrive users", error });
    });
}

export function getUserById(req, res) {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.json({ user });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed to retrive user", error });
    });
}
