
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { UserPlus, Mail, Lock, User } from "lucide-react";

function UserRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/users/register", form);

            localStorage.setItem("userToken", response.data.token);
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));

            navigate("/Login");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">
                    <UserPlus size={28} />
                </div>

                <span className="section-label">JOIN OUR COMMUNITY</span>
                <h1>Create Your Account<span>.</span></h1>
                <p className="auth-description">
                    Join Dynamic Blog and share your thoughts through likes and comments.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <label>Full Name</label>
                    <div className="auth-input-wrap">
                        <User size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            minLength={2}
                            maxLength={50}
                            required
                        />
                    </div>

                    <label>Email Address</label>
                    <div className="auth-input-wrap">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Password</label>
                    <div className="auth-input-wrap">
                        <Lock size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
}

export default UserRegister;
