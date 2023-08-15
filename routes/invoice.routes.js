import express from "express";
import {
  getMainPage,
  getCostcoInvoice,
  getWalmartInvoice,
  getHebInvoice,
  getCostcoInvoicePage,
  getHebInvoicePage,
  getWalmartInvoicePage,
} from "../controllers/invoice.controllers.js";

const router = express.Router();

router.get("/", getMainPage);

router.get("/costco", getCostcoInvoicePage);
router.post("/costco", getCostcoInvoice);

router.get("/walmart", getWalmartInvoicePage);
router.post("/walmart", getWalmartInvoice);

router.get("/heb", getHebInvoicePage);
router.post("/heb", getHebInvoice);

export default router;
