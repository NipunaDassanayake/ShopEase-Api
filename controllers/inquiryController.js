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
    const id = req.params.id;
    let deletedInquiry;

    if (isItAdmin(req)) {
      deletedInquiry = await Inquiry.findOneAndDelete({ id: id });
    } else if (isItCustomer(req)) {
      deletedInquiry = await Inquiry.findOneAndDelete({
        id: id,
        email: req.user.email,
      });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete inquiries" });
    }

    if (!deletedInquiry) {
      return res
        .status(404)
        .json({ message: "Inquiry not found or unauthorized" });
    }

    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
}

export async function updateInquiry(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;

    if (isItAdmin(req)) {
      const inquiry = await Inquiry.findByIdAndUpdate(id, data, { new: true });

      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      return res
        .status(200)
        .json({ message: "Inquiry updated successfully", inquiry });
    }

    if (isItCustomer(req)) {
      const inquiry = await Inquiry.findOneAndUpdate(
        { _id: id, email: req.user.email },
        { message: data.message },
        { new: true }
      );

      if (!inquiry) {
        return res
          .status(404)
          .json({ message: "Inquiry not found or unauthorized" });
      }
      return res
        .status(200)
        .json({ message: "Inquiry updated successfully", inquiry });
    }

    return res
      .status(403)
      .json({ message: "Unauthorized to update inquiries" });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Failed to update inquiry" });
  }
}
