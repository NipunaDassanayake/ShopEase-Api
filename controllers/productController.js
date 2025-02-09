import Product from "../models/products.js";

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
    res.json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to create product", error });
  }
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


export async function updateProduct(req, res) {
  const id = req.params.id;
  const data = req.body;
 
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    } else {
      product.name = data.name || product.name;
      product.price = data.price || product.price;
      product.category = data.category || product.category;
      product.brand = data.brand || product.brand;
      product.countInStock = data.countInStock || product.countInStock;
      product.description = data.description || product.description;
      product.image = data.image || product.image;
      
      await product.save();
    }
  } catch (error) {
    
    res.status(500).json({ message: "failed to update product", error });
  }
}
