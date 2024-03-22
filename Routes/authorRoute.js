const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");

router.get("/", authorController.getAllAuthor);
router.post("/add/", authorController.addAuthor);
router.get("/get/", authorController.getAuthor);
router.put("/update/", authorController.updateAuthor);
router.put("/delete/", authorController.deleteAuthor);
module.exports = router;
