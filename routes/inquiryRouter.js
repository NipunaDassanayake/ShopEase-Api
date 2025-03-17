import express from "express";
import { addInquiry , getAllInquiries , deleteInquiry, updateInquiry} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();
inquiryRouter.post("/", addInquiry);
inquiryRouter.get("/", getAllInquiries);
inquiryRouter.delete("/:id", deleteInquiry);
inquiryRouter.put("/:id", updateInquiry);
export default inquiryRouter;
