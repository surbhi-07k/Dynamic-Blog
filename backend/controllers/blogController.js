
const Blog = require("../models/Blog");

// ==========================================
// CREATE BLOG - ADMIN ONLY
// ==========================================
exports.createBlog = async (req, res) => {
    try {
        const { title, description, mediaType, mediaUrl } = req.body;

        if (!title?.trim() || !description?.trim() || !mediaUrl?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title, description and media URL are required",
            });
        }

        const blog = await Blog.create({
            title: title.trim(),
            description: description.trim(),
            mediaType: mediaType || "image",
            mediaUrl: mediaUrl.trim(),
            author: req.admin.id,
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        console.error("Create Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
        });
    }
};

// ==========================================
// GET ALL BLOGS - PUBLIC
// ==========================================
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "username")
            .populate("comments.user", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalBlogs: blogs.length,
            blogs,
        });
    } catch (error) {
        console.error("Get Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
        });
    }
};

// ==========================================
// GET SINGLE BLOG - PUBLIC
// ==========================================
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "username")
            .populate("comments.user", "name avatar");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        console.error("Get Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
        });
    }
};

// ==========================================
// UPDATE BLOG - ADMIN ONLY
// ==========================================
exports.updateBlog = async (req, res) => {
    try {
        const { title, description, mediaType, mediaUrl } = req.body;

        const updates = {};

        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description.trim();
        if (mediaType !== undefined) updates.mediaType = mediaType;
        if (mediaUrl !== undefined) updates.mediaUrl = mediaUrl.trim();

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.error("Update Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update blog",
        });
    }
};

// ==========================================
// DELETE BLOG - ADMIN ONLY
// ==========================================
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Delete Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
        });
    }
};

// ==========================================
// LIKE / UNLIKE BLOG - REGISTERED USERS ONLY
// ==========================================
exports.toggleLike = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        const alreadyLiked = blog.likes.includes(userId);

        if (alreadyLiked) {
            await Blog.updateOne(
                { _id: blog._id },
                { $pull: { likes: userId } }
            );
        } else {
            await Blog.updateOne(
                { _id: blog._id },
                { $addToSet: { likes: userId } }
            );
        }

        const updatedBlog = await Blog.findById(blog._id);

        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Like removed" : "Blog liked successfully",
            liked: !alreadyLiked,
            totalLikes: updatedBlog.likes.length,
        });
    } catch (error) {
        console.error("Like Error:", error);

        return res.status(500).json({
            success: false,
            message: "Like operation failed",
        });
    }
};

// ==========================================
// ADD COMMENT - REGISTERED USERS ONLY
// ==========================================
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment is required",
            });
        }

        if (text.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 1000 characters",
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        blog.comments.push({
            user: req.user._id,
            name: req.user.name,
            text: text.trim(),
        });

        await blog.save();

        await blog.populate("comments.user", "name avatar");

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            totalComments: blog.comments.length,
            comments: blog.comments,
        });
    } catch (error) {
        console.error("Add Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
        });
    }
};
