import express from "express"
import { CategoryController } from "../Controllers/index.js";

const router = express.Router();

router.get("/", CategoryController.categories)

export default router