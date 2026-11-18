
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Plus,
    Trash2,
    Edit,
    LogOut,
    Upload,
    X,
    LayoutDashboard,
    FileText,
    Heart,
    Eye,
    CalendarDays,
} from "lucide-react";

import API from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const admin = JSON.parse(localStorage.getItem("adminInfo") || "null");

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        mediaType: "image",
        mediaUrl: "",
    });

    // Fetch all blogs
    const getBlogs = async () => {
        try {
            const response = await API.get("/blogs");
            const data = response.data;

            setBlogs(
                Array.isArray(data)
                    ? data
                    : data.blogs || data.data?.blogs || []
            );
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load blogs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    // Release temporary image/video previews
    useEffect(() => {
        return () => {
            if (preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Reset editor
    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            mediaType: "image",
            mediaUrl: "",
        });

        setSelectedFile(null);
        setPreview("");
        setEditingId(null);
    };

    // Select media
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            setError("Please select an image, GIF or video.");
            e.target.value = "";
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setError("File size must be below 50 MB.");
            e.target.value = "";
            return;
        }

        setError("");
        setSuccess("");

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));

        setForm((previous) => ({
            ...previous,
            mediaType: isVideo
                ? "video"
                : file.type === "image/gif"
                    ? "gif"
                    : "image",
        }));
    };

    // Upload media to server
    const uploadMedia = async () => {
        if (!selectedFile) return form.mediaUrl;

        const formData = new FormData();
        formData.append("media", selectedFile);

        setUploading(true);

        try {
            const response = await API.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const uploadedUrl =
                response.data.mediaUrl ||
                response.data.url ||
                response.data.data?.mediaUrl;

            const uploadedType =
                response.data.mediaType ||
                response.data.data?.mediaType ||
                form.mediaType;

            if (!uploadedUrl) {
                throw new Error("Media URL was not returned by the server.");
            }

            setForm((previous) => ({
                ...previous,
                mediaUrl: uploadedUrl,
                mediaType: uploadedType,
            }));

            return uploadedUrl;
        } finally {
            setUploading(false);
        }
    };

    // Create or update blog
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.title.trim() || !form.description.trim()) {
            setError("Please enter a title and description.");
            return;
        }

        setSaving(true);

        try {
            let mediaUrl = form.mediaUrl;

            if (selectedFile) {
                mediaUrl = await uploadMedia();
            }

            if (!mediaUrl) {
                setError("Please select a cover image, GIF or video.");
                return;
            }

            const blogData = {
                title: form.title.trim(),
                description: form.description.trim(),
                mediaType: form.mediaType,
                mediaUrl,
            };

            if (editingId) {
                await API.put(`/blogs/${editingId}`, blogData);
                setSuccess("Blog updated successfully!");
            } else {
                await API.post("/blogs", blogData);
                setSuccess("Blog published successfully!");
            }

            resetForm();
            await getBlogs();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to save blog."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit blog
    const handleEdit = (blog) => {
        setEditingId(blog._id);

        setForm({
            title: blog.title || "",
            description: blog.description || "",
            mediaType: blog.mediaType || "image",
            mediaUrl: blog.mediaUrl || "",
        });

        setSelectedFile(null);
        setPreview(blog.mediaUrl || "");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete blog
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this blog?"
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await API.delete(`/blogs/${id}`);

            setBlogs((previous) =>
                previous.filter((blog) => blog._id !== id)
            );

            if (editingId === id) {
                resetForm();
            }

            setSuccess("Blog deleted successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to delete blog."
            );
        }
    };

    // Admin logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        navigate("/admin/login", { replace: true });
    };

    const totalLikes = blogs.reduce(
        (total, blog) => total + (blog.likes?.length || 0),
        0
    );

    const totalComments = blogs.reduce(
        (total, blog) => total + (blog.comments?.length || 0),
        0
    );

    return (
        <main className="dashboard-page">
            <div className="container">

                {/* Dashboard Header */}
                <header className="dashboard-header">
                    <div>
                        <span className="section-label">CONTROL CENTER</span>
                        <h1>
                            Admin <span>Dashboard.</span>
                        </h1>
                        <p>
                            Welcome back{admin?.username ? `, ${admin.username}` : ""}.
                            Manage your publications and content.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </header>

                {/* Dashboard Statistics */}
                <div className="dashboard-stats">

                    <div className="dashboard-stat card">
                        <LayoutDashboard size={22} />
                        <div>
                            <h3>{blogs.length}</h3>
                            <p>Total Publications</p>
                        </div>
                    </div>

                    <div className="dashboard-stat card">
                        <Heart size={22} />
                        <div>
                            <h3>{totalLikes}</h3>
                            <p>Total Likes</p>
                        </div>
                    </div>

                    <div className="dashboard-stat card">
                        <FileText size={22} />
                        <div>
                            <h3>{totalComments}</h3>
                            <p>Total Comments</p>
                        </div>
                    </div>

                </div>

                {/* Notifications */}
                {error && (
                    <div className="dashboard-error">
                        {error}
                        <button onClick={() => setError("")}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="dashboard-success">
                        {success}
                        <button onClick={() => setSuccess("")}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Blog Editor */}
                <section className="dashboard-editor card">

                    <div className="editor-heading">
                        <div>
                            <span className="section-label">
                                {editingId ? "UPDATE PUBLICATION" : "NEW PUBLICATION"}
                            </span>

                            <h2>
                                {editingId ? "Edit Blog" : "Create New Blog"}
                            </h2>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={resetForm}
                            >
                                <X size={16} />
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="editor-form">

                        <label>Blog Title</label>

                        <input
                            type="text"
                            placeholder="Enter an interesting title..."
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            maxLength={150}
                            required
                        />

                        <label>Blog Description</label>

                        <textarea
                            placeholder="Write your complete blog content..."
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            required
                        />

                        <label>Cover Media (Image / GIF / Video)</label>

                        <div className="upload-area">
                            <input
                                id="blog-media"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                                onChange={handleFileChange}
                            />

                            <label htmlFor="blog-media" className="upload-label">
                                <Upload size={25} />

                                <span>
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Click to select media"}
                                </span>

                                <small>Maximum file size: 50 MB</small>
                            </label>
                        </div>

                        {preview && (
                            <div className="upload-preview">
                                {form.mediaType === "video" ? (
                                    <video src={preview} controls />
                                ) : (
                                    <img src={preview} alt="Media preview" />
                                )}
                            </div>
                        )}

                        <button
                            className="btn btn-primary editor-submit"
                            type="submit"
                            disabled={saving || uploading}
                        >
                            <Plus size={18} />

                            {uploading
                                ? "Uploading Media..."
                                : saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Blog"
                                        : "Publish Blog"}
                        </button>

                    </form>
                </section>

                {/* Blog Library */}
                <section className="dashboard-blog-list">

                    <div className="editor-heading">
                        <div>
                            <span className="section-label">CONTENT LIBRARY</span>
                            <h2>Your Publications</h2>
                        </div>
                    </div>

                    {loading ? (
                        <p className="status-message">
                            Loading publications...
                        </p>
                    ) : blogs.length === 0 ? (
                        <p className="status-message">
                            No blogs available yet. Create your first publication!
                        </p>
                    ) : (
                        <div className="admin-blog-list">

                            {blogs.map((blog) => (
                                <div className="admin-blog-item card" key={blog._id}>

                                    {/* Blog Media */}
                                    {blog.mediaUrl && (
                                        <div className="admin-blog-thumbnail">
                                            {blog.mediaType === "video" ? (
                                                <video src={blog.mediaUrl} muted />
                                            ) : (
                                                <img
                                                    src={blog.mediaUrl}
                                                    alt={blog.title}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Blog Information */}
                                    <div className="admin-blog-info">
                                        <h3>{blog.title}</h3>

                                        <p>
                                            {blog.description?.slice(0, 120)}
                                            {blog.description?.length > 120 ? "..." : ""}
                                        </p>

                                        <div className="admin-blog-meta">
                                            <span>
                                                <Heart size={14} />
                                                {blog.likes?.length || 0} likes
                                            </span>

                                            <span>
                                                <FileText size={14} />
                                                {blog.comments?.length || 0} comments
                                            </span>

                                            <span>
                                                <CalendarDays size={14} />
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Blog Actions */}
                                    <div className="admin-blog-actions">

                                        <Link
                                            to={`/blog/${blog._id}`}
                                            className="btn btn-outline"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>

                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleEdit(blog)}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

export default AdminDashboard;
