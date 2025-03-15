import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: "uncategorized",
  },
  description: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  productImage: {
    type: [String],
    required: true,
    default: [
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fplaceholder-image&psig=AOvVaw1f2kpanycwD_Fd2Cyf2jj3&ust=1742147915360000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJDNu-3UjIwDFQAAAAAdAAAAABAJ",
    ],
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
});
// Auto-generate the `key` field before saving
ProductSchema.pre("save", async function (next) {
  if (!this.key) {
    this.key = `PROD-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a random product key
  }
  next();
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
