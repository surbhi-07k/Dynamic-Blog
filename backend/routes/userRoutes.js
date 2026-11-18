
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
} = require("../controllers/userController");

// Visitor registration
router.post("/register", registerUser);

// Visitor login
router.post("/login", loginUser);

module.exports = router;
