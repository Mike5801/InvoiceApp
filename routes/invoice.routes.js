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

router.get("/costco", getCostcoInvoicePage);

router.get("/walmart", getWalmartInvoicePage);

router.get("/heb", getHebInvoicePage);

router.post("/costco", getCostcoInvoice);

router.post("/walmart", getWalmartInvoice);

router.post("/heb", getHebInvoice);

export default router;
