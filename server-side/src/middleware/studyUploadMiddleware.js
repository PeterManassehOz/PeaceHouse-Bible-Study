const multer = require('multer');
const path = require('path');

// Define accepted file types
const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const epubType = 'application/epub+zip';

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`📂 Processing file: ${file.originalname}`);
        console.log(`📄 Uploaded File MIME Type: ${file.mimetype}`);

        let uploadPath = 'uploads/others/'; // Default path

        if (imageTypes.includes(file.mimetype)) {
            uploadPath = 'uploads/images/';
        } else if (documentTypes.includes(file.mimetype)) {
            uploadPath = 'uploads/files/';
        } else if (file.mimetype === epubType) {
            uploadPath = 'uploads/ebooks/';
        }

        console.log(`✅ Assigned upload path: ${uploadPath}`);

        req.uploadPath = uploadPath; // Store the path for later use
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`; // Remove spaces
        req.filePath = `${req.uploadPath}${uniqueName}`; // Store the relative filePath
        
        console.log(`📝 Generated filename: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [...imageTypes, ...documentTypes, epubType];

    if (allowedTypes.includes(file.mimetype)) {
        console.log(`✅ File accepted: ${file.originalname}`);
        cb(null, true);
    } else {
        console.error(`❌ Invalid file type: ${file.mimetype}`);
        cb(new Error('Only JPEG, PNG, JPG, PDF, DOC, and EPUB files are allowed'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter 
});

module.exports = upload;
