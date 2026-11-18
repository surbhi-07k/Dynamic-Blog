const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadMedia } = require("../controllers/uploadController");
const verifyAdmin = require("../middleware/authMiddleware");

router.post(
    "/",
    verifyAdmin,
    upload.single("media"),
    uploadMedia
);

module.exports = router;