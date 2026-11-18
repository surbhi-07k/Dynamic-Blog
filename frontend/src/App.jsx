
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";

import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          {/* User Authentication */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Protected Admin Pages */}
          <Route element={<AdminProtectedRoute />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
