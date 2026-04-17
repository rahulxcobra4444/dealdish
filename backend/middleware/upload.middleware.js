const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { errorResponse } = require('../utils/apiResponse');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `dealdish/${folder}`, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

const handleUpload = (fieldName) => async (req, res, next) => {
  upload.single(fieldName)(req, res, async (err) => {
    if (err) {
      return errorResponse(res, 400, err.message);
    }
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'restaurants');
        req.imageUrl = result.secure_url;
      } catch (uploadError) {
        return errorResponse(res, 500, 'Image upload failed');
      }
    }
    next();
  });
};

module.exports = { upload, uploadToCloudinary, handleUpload };