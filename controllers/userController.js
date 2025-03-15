import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10); // hashing password using bycrypt

  const newUser = new User(data);
  if (req.user.role === "admin") {
    newUser
      .save()
      .then(() => {
        res.json({ message: "User created successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "User creation failed", error });
      });
  } else {
    if (newUser.role === "admin") {
      res.status(401).json({ message: "Unauthorized to create admin account" });
    } else {
      newUser
        .save()
        .then(() => {
          res.json({ message: "User created successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: "User creation failed", error });
        });
    }
  }
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
            phone: user.phone,
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

export function checkLogin(req){
  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }
}

export function isItAdmin(req){
  let isAdmin = false;

   if(req.user != null){
     if(req.user.role === "admin"){
       isAdmin = true;
     }
   }
   return isAdmin;
}

export function isItCustomer(req){
  let isCustomer = false;

   if(req.user != null){
     if(req.user.role === "customer"){
       isCustomer = true;
     }
   }
   return isCustomer;
}