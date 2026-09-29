const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadDir),
    filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}${extensions[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => extensions[file.mimetype]
    ? callback(null, true)
    : callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image')),
});
