const express = require('express');
const { createStudy, updateStudy, deleteStudy, getSingleStudyById, getAllStudies, addComment, deleteComment, reactToStudy, markStudyInProgress, markStudyCompleted, trackStudyDownload, getUserDashboard, getPlatformStatistics, studyCompleted, getUserActivityByAdmin, getStudyToDownload, getStudyReactions, getMarkStudyCompleted, getMarkStudyInProgress, getUserDownloads, findUserByEmail } = require('../controllers/studies.controller');
const upload = require('../middleware/studyUploadMiddleware');
const { adminProtect }  = require('../middleware/adminProtect'); // CommonJS import
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware


const router = express.Router();



router.get("/stats", adminAuthMiddleware, adminProtect, getPlatformStatistics); // ✅ Fetch platform statistics

router.get("/dashboard", protect, getUserDashboard); // ✅ Fetch dashboard data


router.get('/completed', protect, getMarkStudyCompleted); // Route to fetch completed studies

router.get('/reading', protect, getMarkStudyInProgress); // ✅ Get studies user is currently reading

router.get("/downloads", protect, getUserDownloads); // ✅ Fetch all studies downloaded by a user


router.get("/find-user/:email", adminAuthMiddleware, adminProtect, findUserByEmail);


router.post('/', adminAuthMiddleware, adminProtect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), createStudy);
router.get('/', getAllStudies);
router.get('/:id', getSingleStudyById);
router.put('/:id', adminAuthMiddleware, adminProtect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updateStudy);
router.delete('/:id', adminAuthMiddleware, adminProtect, deleteStudy);
router.put("/:id/study-completed", adminAuthMiddleware, adminProtect, studyCompleted); // ✅ Mark study as completed by admin

router.post("/:id/comment", protect, addComment);
router.delete("/:studyId/comment/:commentId", protect, deleteComment);
router.post("/:id/react", protect, reactToStudy);
router.get("/:id/reactions", protect, getStudyReactions);


// Admin checks a specific user's activities
router.get("/:id/activity", adminAuthMiddleware, adminProtect, getUserActivityByAdmin);

router.patch("/:id/completed", protect, markStudyCompleted); // ✅ Mark study as completed by user
router.patch("/:id/reading", protect, markStudyInProgress); // ✅ Mark study as in-progress by user
router.patch("/:id/download", protect, trackStudyDownload); // ✅ Track downloads by user
router.get("/:id/download", protect, getStudyToDownload); // ✅ Downloads by user



module.exports = router;
