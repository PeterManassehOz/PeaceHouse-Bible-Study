const express = require('express');
const { getSingleStudyById, getAllStudies, addComment, deleteComment, reactToStudy, markStudyInProgress, markStudyCompleted, trackStudyDownload, getUserDashboard, getStudyToDownload, getStudyReactions, getMarkStudyCompleted, getMarkStudyInProgress, getUserDownloads } = require('../controllers/studies.controller');
const upload = require('../middleware/studyUploadMiddleware');
const { adminProtect }  = require('../middleware/adminProtect'); // CommonJS import
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware


const router = express.Router();



router.get("/dashboard", protect, getUserDashboard); // ✅ Fetch dashboard data


router.get('/completed', protect, getMarkStudyCompleted); // Route to fetch completed studies

router.get('/reading', protect, getMarkStudyInProgress); // ✅ Get studies user is currently reading

router.get("/downloads", protect, getUserDownloads); // ✅ Fetch all studies downloaded by a user


router.get('/', getAllStudies);
router.get('/:id', getSingleStudyById);

router.post("/:id/comment", protect, addComment);
router.delete("/:studyId/comment/:commentId", protect, deleteComment);
router.post("/:id/react", protect, reactToStudy);
router.get("/:id/reactions", protect, getStudyReactions);



router.patch("/:id/completed", protect, markStudyCompleted); // ✅ Mark study as completed by user
router.patch("/:id/reading", protect, markStudyInProgress); // ✅ Mark study as in-progress by user
router.patch("/:id/download", protect, trackStudyDownload); // ✅ Track downloads by user
router.get("/:id/download", protect, getStudyToDownload); // ✅ Downloads by user



module.exports = router;
