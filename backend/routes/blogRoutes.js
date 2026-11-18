
const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment,
} = require("../controllers/blogController");

const verifyAdmin = require("../middleware/authMiddleware");
const verifyUser = require("../middleware/userAuthMiddleware");

// Public blog reading
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Admin-only blog management
router.post("/", verifyAdmin, createBlog);
router.put("/:id", verifyAdmin, updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);

// Registered-user interactions
router.post("/:id/like", verifyUser, toggleLike);
router.post("/:id/comments", verifyUser, addComment);

module.exports = router;
