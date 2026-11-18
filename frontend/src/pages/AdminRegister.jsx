
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { UserPlus, Mail, Lock, User } from "lucide-react";

function AdminRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            await API.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            navigate("/admin/login", {
                state: { message: "Admin registered successfully. Please login." },
            });
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

                <span className="section-label">ADMINISTRATION</span>
                <h1>Create Admin Account<span>.</span></h1>

                <p className="auth-description">
                    Register an administrator account to manage Dynamic Blog.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <label>Username</label>
                    <div className="auth-input-wrap">
                        <User size={18} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Email Address</label>
                    <div className="auth-input-wrap">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
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
                            placeholder="Minimum 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <label>Confirm Password</label>
                    <div className="auth-input-wrap">
                        <Lock size={18} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register Admin"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/admin/login">Admin Login</Link>
                </p>
            </div>
        </main>
    );
}

export default AdminRegister;
