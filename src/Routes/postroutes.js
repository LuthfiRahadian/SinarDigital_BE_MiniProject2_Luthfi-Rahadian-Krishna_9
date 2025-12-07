const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { uploadSingle } = require("../middlewares/upload");

// CRUD posts
router.post("/", uploadSingle("image"), postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", uploadSingle("image"), postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
