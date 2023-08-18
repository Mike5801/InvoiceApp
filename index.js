import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* global settings */
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const oneDay = 1000 * 60 * 60 * 24;
app.set("view engine", "pug");

/* Middleware settings */
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
//Erases browser cache on browser back button
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const PORT = process.env.PORT || 5001;

/* Routes */
import invoiceRoutes from "./routes/invoice.routes.js";
import userRoutes from "./routes/user.routes.js";
import { isAuth } from "./middlewares/auth.middleware.js";

app.use("/invoice", isAuth, invoiceRoutes);
app.use("/", userRoutes);
app.use("*", (req, res) => {
  res.redirect("/");
})

import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Running Success, Server Port: ${PORT}`)
    );
  })
  .catch((error) => console.log(error));
