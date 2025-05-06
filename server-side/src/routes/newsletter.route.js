const express = require("express");
const { subscribeNewsletter, getSubscriptionStatus, getAllSubscribers } = require("../controllers/newsletter.controller");
const { protect } = require("../middleware/authMiddleware");
const { adminProtect, adminOnly } = require('../middleware/adminProtect'); // 🔥 Import both
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');



const router = express.Router();

router.post("/subscribe", protect, subscribeNewsletter);
router.get("/status", protect, getSubscriptionStatus);
router.get("/all-subscribers",  adminAuthMiddleware, adminProtect, getAllSubscribers);

module.exports = router;