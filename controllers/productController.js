import Product from "../models/products.js";
import { isItAdmin } from "./userController.js";

export async function createProduct(req, res) {
  console.log(req.user);

  if (req.user == null) {
    res.status(401).json({ message: "please login and try again" });
    return;
  }
  if (req.user.role !== "admin") {
    res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
    return;
  }

  const data = req.body;
  const newProduct = new Product(data);
  try {
    await newProduct.save();
    console.log(newProduct.key);
    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to create product", error });
  }
}
export async function getAllProducts(req, res) {



  try {
    if (isItAdmin(req)) {
      // Admin can see all products
     const products = await Product.find();
     res.status(200).json({ products });
      return;
    } else {
      // Regular users can only see available products
      const products = await Product.find({ availability: true });
      res.status(200).json({ products });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve products", error: error.message });
  }
}

// Product.find()
//   .then((products) => {
//     res.json({ products });
//   })
//   .catch((error) => {
//     res.status(500).json({ message: "failed to retrive products", error });
//   });

export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve product", error: error.message });
  }
}

export async function updateProduct(req, res) {

  try {
    if (isItAdmin(req)) {
      const { id } = req.params;
      const data = req.body;
      await Product.updateOne({ _id: id }, data);
      res.status(200).json({ message: "Product updated successfully" });
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

  } catch (error) {
    res.status(500).json({ message: "failed to update product", error });
  }
}

export async function deleteProduct(req, res) {
  try {
    if (isItAdmin(req)) {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to delete product", error });
  }
}






