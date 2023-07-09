import express from "express"
import { getCostcoInvoice } from "../controllers/invoice.controllers.js"

const router = express.Router()

router.get("/costco", getCostcoInvoice)

export default router