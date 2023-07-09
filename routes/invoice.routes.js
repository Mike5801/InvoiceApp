import express from "express";
import { getCostcoInvoice, getWalmartInvoice } from "../controllers/invoice.controllers.js";

const router = express.Router();

router.post("/costco", getCostcoInvoice);

router.post("/walmart", getWalmartInvoice);

export default router;
