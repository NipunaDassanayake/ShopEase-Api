import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
  try {
    if (!isItCustomer(req)) {
      return res
        .status(403)
        .json({ message: "Only customers can create inquiries" });
    }

    const data = req.body;
    data.email = req.user.email;
    data.phone = req.user.phone;

    // Find last inquiry to set ID
    let id = 1; // Default ID if no inquiries exist
    const lastInquiry = await Inquiry.find().sort({ id: -1 }).limit(1);

    if (lastInquiry.length > 0) {
      id = lastInquiry[0].id + 1;
    }

    data.id = id;

    const newInquiry = new Inquiry(data);
    const response = await newInquiry.save();

    res.json({ message: "Inquiry created successfully", id: response.id });
  } catch (error) {
    res.status(500).json({ message: "Inquiry creation failed", error });
  }
}

export async function getAllInquiries(req, res) {
  try {
    if (isItCustomer(req)) {
      const inquiries = await Inquiry.find({ email: req.user.email });
      res.json({ inquiries });
      return;
    } else if (req.user.role === "admin") {
      const inquiries = await Inquiry.find();
      res.json({ inquiries });
      return;
    } else {
      res.status(403).json({ message: "Unauthorized to view inquiries" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inquiries", error });
  }
}

export async function deleteInquiry(req, res) {
  try {
    if (isItAdmin(req)) {
      const id = req.params.id;
      await Inquiry.deleteOne({ id: id });
      res.json({ message: "Inquiry deleted successfully" });
    } else if (isItCustomer(req)) {
      const id = req.params.id;
      await Inquiry.deleteOne({ id: id, email: req.user.email });
      res.json({ message: "Inquiry deleted successfully" });
    } else {
      res.status(403).json({ message: "Unauthorized to delete inquiries" });
    }
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Failed to delete inquiry", error });
  }
}
