
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate visitor JWT
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER VISITOR
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",
            });
        }

        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 50 characters",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        console.error("Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// LOGIN VISITOR
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};
