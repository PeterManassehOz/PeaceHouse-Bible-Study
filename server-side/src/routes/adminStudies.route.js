const express = require('express');
const { createStudy, updateStudy, deleteStudy, getSingleStudyById, getAllStudies, getPlatformStatistics, getUserActivityByAdmin, findUserByEmail, studyCompleted } = require('../controllers/adminStudies.controller');
const upload = require('../middleware/studyUploadMiddleware');
const { adminProtect }  = require('../middleware/adminProtect'); // CommonJS import
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware


const router = express.Router();



router.get("/stats", adminAuthMiddleware, adminProtect, getPlatformStatistics); 


router.get("/find-user/:email", adminAuthMiddleware, adminProtect, findUserByEmail);


router.post('/', adminAuthMiddleware, adminProtect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), createStudy);
router.get('/', getAllStudies);
router.get('/:id', getSingleStudyById);
router.put('/:id', adminAuthMiddleware, adminProtect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updateStudy);
router.delete('/:id', adminAuthMiddleware, adminProtect, deleteStudy);
router.put("/:id/study-completed", adminAuthMiddleware, adminProtect, studyCompleted); // ✅ Mark study as completed by admin



// Admin checks a specific user's activities
router.get("/:id/activity", adminAuthMiddleware, adminProtect, getUserActivityByAdmin);


module.exports = router;