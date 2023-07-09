import express from "express";
import { getCostcoInvoice, getWalmartInvoice, getHebInvoice } from "../controllers/invoice.controllers.js";

const router = express.Router();

router.post("/costco", getCostcoInvoice);

router.post("/walmart", getWalmartInvoice);

router.post("/heb", getHebInvoice);

export default router;
