
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../services/api";

function AdminProtectedRoute() {
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                setChecking(false);
                return;
            }

            try {
                await API.get("/auth/profile");
                setAuthorized(true);
            } catch (error) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminInfo");
                setAuthorized(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAdmin();
    }, []);

    if (checking) {
        return <div className="status-message">Verifying admin access...</div>;
    }

    return authorized ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default AdminProtectedRoute;
