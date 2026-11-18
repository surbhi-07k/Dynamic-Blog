const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a file"
            });
        }

        const isVideo = req.file.mimetype.startsWith("video/");

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "dynamic-blog",
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: "Cloudinary upload failed",
                        error: error.message
                    });
                }

                res.status(200).json({
                    message: "Media uploaded successfully",
                    mediaUrl: result.secure_url,
                    mediaType: isVideo
                        ? "video"
                        : req.file.mimetype === "image/gif"
                            ? "gif"
                            : "image"
                });
            }
        );

        streamifier.createReadStream(req.file.buffer)
            .pipe(uploadStream);

    } catch (error) {
        res.status(500).json({
            message: "Upload failed",
            error: error.message
        });
    }
};