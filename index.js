import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

/* global settings */
dotenv.config();
const corsOptions = {
  origin: [process.env.ORIGIN],
  credentials: true,
};

const app = express();

/* Middleware settings */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5001;

/* Routes */
import invoiceRoutes from "./routes/invoice.routes.js"

app.use("/invoice", invoiceRoutes)

app.listen(PORT, () => console.log(`Running Success, Server Port: ${PORT}`));

/* MONGOOSE SETUP */
//import mongoose from "mongoose";
// mongoose.set('strictQuery', false);
// mongoose.connect(process.env.MONGO_URL, {
  //   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   dbName: process.env.DB_NAME
// }).then(() => {
//   app.listen(PORT, () => console.log(`Server Port: ${ PORT }`));
// }).catch((error) => console.log(`${ error } did not connect`));
