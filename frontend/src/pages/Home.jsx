
import { useEffect, useState } from "react";
import { ArrowDown, TrendingUp } from "lucide-react";
import API from "../services/api";
import BlogCard from "../components/BlogCard";

function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await API.get("/blogs");
                setBlogs(response.data.blogs || response.data);
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
                setError("Unable to load blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <main>

            <section className="hero-section">
                <div className="container hero-content">

                    <span className="hero-label">
                        <TrendingUp size={16} />
                        IDEAS THAT MATTER
                    </span>

                    <h1>
                        YOUR STORIES.
                        <br />
                        YOUR <span>SPACE.</span>
                    </h1>

                    <p>
                        Discover fresh perspectives, explore meaningful ideas
                        and read stories worth sharing.
                    </p>

                    <a href="#latest" className="btn btn-primary hero-button">
                        Explore Stories
                        <ArrowDown size={18} />
                    </a>

                    <div className="hero-decoration">DB.</div>

                </div>
            </section>

            <section className="latest-section" id="latest">
                <div className="container">

                    <div className="section-heading">
                        <div>
                            <span className="section-label">DISCOVER</span>
                            <h2>Latest <span>Stories.</span></h2>
                        </div>

                        <p>Explore our latest publications.</p>
                    </div>

                    {loading ? (
                        <p className="status-message">Loading stories...</p>
                    ) : error ? (
                        <p className="status-message error">{error}</p>
                    ) : blogs.length === 0 ? (
                        <div className="empty-state">
                            <h3>No stories published yet.</h3>
                            <p>Check back soon for something interesting.</p>
                        </div>
                    ) : (
                        <div className="blog-grid">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}

export default Home;
