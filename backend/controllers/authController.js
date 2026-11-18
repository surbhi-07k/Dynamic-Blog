
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ADMIN REGISTER - ONLY FIRST ADMIN ALLOWED
exports.registerAdmin = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.toLowerCase().trim();
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Block registration if an admin already exists
        const adminExists = await Admin.exists({});

        if (adminExists) {
            return res.status(403).json({
                message: "Admin registration is disabled. An admin account already exists."
            });
        }

        const existingAdmin = await Admin.findOne({
            $or: [{ email }, { username }]
        });

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin registration error:", error);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
};

// ADMIN LOGIN
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
};
