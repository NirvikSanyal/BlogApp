const express = require("express");
const postController = require("../controllers/postController");
const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const upload = require("../middleware/upload");

const router = express.Router();
router.get("/", postController.getAllPosts);
router.get("/admin/all", requireAuth, requireAdmin, postController.getAllPosts);
router.get("/:id", postController.getPost);
router.post("/", requireAuth, upload.single("image"), postController.createPost);
router.put("/:id", requireAuth, upload.single("image"), postController.updatePost);
router.delete("/:id", requireAuth, postController.deletePost);

module.exports = router;
