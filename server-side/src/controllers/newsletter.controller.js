const Newsletter = require("../models/newsletter.model");

// 🔹 Subscribe to Newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists (user is subscribed)
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      // Instead of returning an error, unsubscribe
      await Newsletter.findOneAndDelete({ email });
      return res.status(200).json({ message: "You have successfully unsubscribed.", subscribed: false });
    }

    // Otherwise, subscribe
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "You have successfully subscribed!", subscribed: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// 🔹 Get Subscription Status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const isSubscribed = await Newsletter.findOne({ email });
    res.status(200).json({ subscribed: !!isSubscribed });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = { subscribeNewsletter, getSubscriptionStatus};
