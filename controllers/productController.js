import Product from "../models/products.js";

export function createProduct(req, res) {
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
  newProduct
    .save()
    .then(() => {
      res.json({ message: "Product created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Product creation failed", error });
    });
}

export function getAllProducts(req, res) {
  Product.find()
    .then((products) => {
      res.json({ products });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed to retrive products", error });
    });
}

export function getProductById(req, res) {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      res.json({ product });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed to retrive product", error });
    });
}
