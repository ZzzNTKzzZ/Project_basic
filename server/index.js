import express, { json } from "express";
import dotenv from "dotenv";
import routes from "./Routes/index.js";
import { engine } from "express-handlebars";
import connectDB from "./db.js";
import cors from "cors";
import multer from "multer";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", "./views");

// Routes
routes(app);

connectDB()
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
