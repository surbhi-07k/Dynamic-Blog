
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, LogIn, ShieldCheck } from "lucide-react";

function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const successMessage = location.state?.message;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", form);

            localStorage.setItem("adminToken", response.data.token);
            localStorage.setItem("adminInfo", JSON.stringify(response.data.admin));

            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">
                    <ShieldCheck size={28} />
                </div>

                <span className="section-label">ADMINISTRATION</span>
                <h1>Admin Login<span>.</span></h1>

                <p className="auth-description">
                    Sign in to manage blogs, content and your platform.
                </p>

                {successMessage && (
                    <p className="auth-success">{successMessage}</p>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <label>Email Address</label>
                    <div className="auth-input-wrap">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter admin email"
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
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login as Admin"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an admin account?{" "}
                    <Link to="/admin/register">Register Admin</Link>
                </p>

                <p className="auth-switch">
                    Are you a visitor? <Link to="/login">User Login</Link>
                </p>
            </div>
        </main>
    );
}

export default AdminLogin;
