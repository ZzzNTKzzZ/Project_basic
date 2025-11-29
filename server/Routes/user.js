import express from "express"
import UserController from "../Controllers/UserController.js";
import multer from "multer";
import fs from "fs"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatar";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({storage})

const router = express.Router();

router.get("/", UserController.users)
router.get("/:id", UserController.user)
router.post("/login", UserController.login)
router.post("/signUp", UserController.signUp)
router.patch("/edit/:id", upload.single('image') ,UserController.edit)
router.post("/edit/address/:id", UserController.addAddress);
router.delete("/delete/address/:id", UserController.deleteAddress)
export default router

