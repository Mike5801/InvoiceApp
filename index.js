import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* global settings */
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "pug");

/* Middleware settings */
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5001;

/* Routes */
import invoiceRoutes from "./routes/invoice.routes.js";

app.use("/invoice", invoiceRoutes);

app.get("/", (req, res) => {
  res.render('pages/Main/index');
});

app.listen(PORT, () => console.log(`Running Success, Server Port: ${PORT}`));
