import express from "express";
import { addInquiry , getAllInquiries , deleteInquiry} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();
inquiryRouter.post("/", addInquiry);
inquiryRouter.get("/", getAllInquiries);
inquiryRouter.delete("/:id", deleteInquiry);

export default inquiryRouter;
