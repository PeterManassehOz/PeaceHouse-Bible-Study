const express = require("express");
const { subscribeNewsletter, getSubscriptionStatus } = require("../controllers/newsletter.controller");



const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/subscription-status/:email", getSubscriptionStatus);

module.exports = router;