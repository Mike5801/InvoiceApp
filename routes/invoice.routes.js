import express from "express";
import {
  getCostcoInvoice,
  getWalmartInvoice,
  getHebInvoice,
  getCostcoInvoicePage,
  getHebInvoicePage,
  getWalmartInvoicePage,
} from "../controllers/invoice.controllers.js";

const router = express.Router();

// Toggle Feature Costco
// router.get("/costco", getCostcoInvoicePage);
// router.post("/costco", getCostcoInvoice);

router.get("/walmart", getWalmartInvoicePage);
router.post("/walmart", getWalmartInvoice);

router.get("/heb", getHebInvoicePage);
router.post("/heb", getHebInvoice);

export default router;
