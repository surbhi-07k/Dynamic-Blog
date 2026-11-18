
const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/authController");

const verifyAdmin = require("../middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected route
router.get("/profile", verifyAdmin, (req, res) => {
    res.status(200).json({
        message: "Welcome Admin! Authentication successful.",
        admin: req.admin
    });
});

module.exports = router;
