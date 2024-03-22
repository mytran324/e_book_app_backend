const express = require("express");
const categoryController = require("../controllers/categoryController");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", categoryController.getAllCategory);
router.post("/add/", upload.single("imageUrl"), categoryController.addCategory);
router.get("/get/", categoryController.getCategory);
router.put(
  "/update/",
  upload.single("imageUrl"),
  categoryController.updateCategory
);
router.put("/delete/", categoryController.deleteCategory);

module.exports = router;
