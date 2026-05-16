const multer = require("multer");

// Allowed file types
const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const epubType = "application/epub+zip";

// MEMORY STORAGE (IMPORTANT)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...imageTypes,
    ...documentTypes,
    epubType,
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, PDF, DOC, DOCX and EPUB files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;