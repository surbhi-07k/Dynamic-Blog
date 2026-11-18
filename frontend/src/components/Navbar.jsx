
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Search,
    Menu,
    X,
    UserCircle,
    LogOut,
    ShieldCheck,
} from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    const admin = JSON.parse(localStorage.getItem("adminInfo") || "null");

    const isUserLoggedIn = Boolean(localStorage.getItem("userToken") && user);
    const isAdminLoggedIn = Boolean(localStorage.getItem("adminToken") && admin);

    const handleUserLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        setMenuOpen(false);
        navigate("/");
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        setMenuOpen(false);
        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="container navbar-inner">

                {/* Logo */}
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <BookOpen size={25} />
                    <span>
                        Dynamic<span className="logo-accent">Blog.</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <Link to="/" onClick={closeMenu}>Home</Link>
                    <a href="/#latest" onClick={closeMenu}>Latest Blogs</a>
                    <a href="/#about" onClick={closeMenu}>About</a>

                    {/* Mobile-only authentication links */}
                    <div className="mobile-auth-links">
                        {isUserLoggedIn ? (
                            <button onClick={handleUserLogout}>
                                <LogOut size={16} /> User Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu}>User Login</Link>
                                <Link to="/register" onClick={closeMenu}>Register</Link>
                            </>
                        )}

                        {isAdminLoggedIn ? (
                            <>
                                <Link to="/admin/dashboard" onClick={closeMenu}>
                                    Admin Dashboard
                                </Link>
                                <button onClick={handleAdminLogout}>
                                    <LogOut size={16} /> Admin Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/admin/login" onClick={closeMenu}>
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="nav-actions">
                    <button className="nav-icon" aria-label="Search">
                        <Search size={20} />
                    </button>

                    {isUserLoggedIn ? (
                        <>
                            <span className="nav-user">
                                <UserCircle size={18} />
                                {user.name}
                            </span>

                            <button
                                className="btn btn-primary"
                                onClick={handleUserLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">
                                Login
                            </Link>

                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </>
                    )}

                    {isAdminLoggedIn ? (
                        <>
                            <Link to="/admin/dashboard" className="admin-nav-link">
                                <ShieldCheck size={16} />
                                Dashboard
                            </Link>

                            <button
                                className="admin-nav-link"
                                onClick={handleAdminLogout}
                            >
                                Admin Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/admin/login" className="admin-nav-link">
                            Admin
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>
        </nav>
    );
}

export default Navbar;
