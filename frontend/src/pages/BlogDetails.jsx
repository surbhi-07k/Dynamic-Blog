
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Heart,
    Share2,
    ArrowLeft,
    Send,
    UserCircle,
} from "lucide-react";

import API from "../services/api";

function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [liking, setLiking] = useState(false);
    const [error, setError] = useState("");

    const userToken = localStorage.getItem("userToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    const fetchBlog = async () => {
        try {
            const response = await API.get(`/blogs/${id}`);
            setBlog(response.data.blog || response.data);
            setError("");
        } catch (err) {
            setError("Unable to load this article.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        if (!userToken) {
            navigate("/login");
            return;
        }

        if (liking) return;

        try {
            setLiking(true);

            await API.post(
                `/blogs/${id}/like`,
                {},
                { useUserToken: true }
            );

            await fetchBlog();
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
            } else {
                alert(err.response?.data?.message || "Unable to update like.");
            }
        } finally {
            setLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!userToken) {
            navigate("/login");
            return;
        }

        if (!comment.trim()) return;

        try {
            setSubmitting(true);

            await API.post(
                `/blogs/${id}/comments`,
                { text: comment.trim() },
                { useUserToken: true }
            );

            setComment("");
            await fetchBlog();
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
            } else {
                alert(err.response?.data?.message || "Unable to submit comment.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.description,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                alert("Article link copied!");
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Sharing failed:", err);
            }
        }
    };

    if (loading) {
        return <div className="status-message">Loading article...</div>;
    }

    if (error || !blog) {
        return (
            <div className="status-message error">
                {error || "Article not found."}
                <p><Link to="/">Return Home</Link></p>
            </div>
        );
    }

    const liked = userInfo
        ? (blog.likes || []).includes(userInfo.id)
        : false;

    return (
        <main className="article-page">
            <div className="container">

                <Link to="/" className="back-link">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <article className="article-content">

                    <span className="section-label">
                        DYNAMIC BLOG / ARTICLE
                    </span>

                    <h1>{blog.title}</h1>

                    <div className="article-meta">
                        <span>Published Article</span>
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {blog.mediaUrl && (
                        <div className="article-media">
                            {blog.mediaType === "video" ? (
                                <video src={blog.mediaUrl} controls />
                            ) : (
                                <img src={blog.mediaUrl} alt={blog.title} />
                            )}
                        </div>
                    )}

                    <div className="article-description">
                        {blog.description}
                    </div>

                    <div className="article-actions">

                        <button
                            className={`article-action ${liked ? "liked" : ""}`}
                            onClick={handleLike}
                            disabled={liking}
                        >
                            <Heart
                                size={19}
                                fill={liked ? "currentColor" : "none"}
                            />
                            {liking ? "Updating..." : `${blog.likes?.length || 0} Likes`}
                        </button>

                        <button
                            className="article-action"
                            onClick={handleShare}
                        >
                            <Share2 size={19} />
                            Share Article
                        </button>

                    </div>

                    <section className="comments-section">

                        <h2>
                            Comments ({blog.comments?.length || 0})
                        </h2>

                        {userToken ? (
                            <form
                                onSubmit={handleComment}
                                className="comment-form"
                            >
                                <p className="comment-user">
                                    <UserCircle size={18} />
                                    Commenting as <strong>{userInfo?.name || "User"}</strong>
                                </p>

                                <textarea
                                    placeholder="Write your thoughts..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    maxLength={1000}
                                    required
                                />

                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    <Send size={16} />
                                    {submitting ? "Posting..." : "Post Comment"}
                                </button>
                            </form>
                        ) : (
                            <div className="comment-login-prompt">
                                <p>Login to like articles and join the conversation.</p>
                                <Link to="/login" className="btn btn-primary">
                                    Login to Comment
                                </Link>
                                <p className="auth-switch">
                                    New here? <Link to="/register">Create Account</Link>
                                </p>
                            </div>
                        )}

                        <div className="comment-list">
                            {blog.comments?.length ? (
                                [...blog.comments].reverse().map((item, index) => (
                                    <div
                                        className="comment-item"
                                        key={item._id || index}
                                    >
                                        <h4>{item.name}</h4>
                                        <p>{item.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="status-message">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>

                    </section>

                </article>
            </div>
        </main>
    );
}

export default BlogDetails;
