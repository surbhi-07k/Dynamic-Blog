
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, Image as ImageIcon } from "lucide-react";

function BlogCard({ blog }) {
    if (!blog) return null;

    const {
        _id,
        title,
        description,
        mediaType,
        mediaUrl,
        likes = [],
    } = blog;

    const preview = description?.length > 130
        ? description.substring(0, 130) + "..."
        : description;

    return (
        <article className="blog-card">

            <div className="blog-card-media">
                {mediaUrl && mediaType === "video" ? (
                    <video src={mediaUrl} muted controls />
                ) : mediaUrl ? (
                    <img src={mediaUrl} alt={title} loading="lazy" />
                ) : (
                    <div className="blog-placeholder">
                        <ImageIcon size={35} />
                    </div>
                )}

                <span className="blog-category">
                    {mediaType || "Article"}
                </span>
            </div>

            <div className="blog-card-content">

                <div className="blog-card-meta">
                    <span>EDITOR'S PICK</span>

                    <span className="blog-likes">
                        <Heart size={15} />
                        {likes.length}
                    </span>
                </div>

                <h3>{title}</h3>

                <p>{preview}</p>

                <Link to={`/blog/${_id}`} className="read-more">
                    Read Article
                    <ArrowUpRight size={17} />
                </Link>

            </div>

        </article>
    );
}

export default BlogCard;
