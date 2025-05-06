const Newsletter = require("../models/newsletter.model");
const User = require("../models/users.model");

// 🔹 Subscribe to Newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or email missing" });
    }

    const email = user.email;

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


// 🔹 Get Subscription Status (based on logged-in user)
const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or email missing" });
    }

    const isSubscribed = await Newsletter.findOne({ email: user.email });
    res.status(200).json({ subscribed: !!isSubscribed });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({}, { email: 1, subscribedAt: 1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


module.exports = { subscribeNewsletter, getSubscriptionStatus, getAllSubscribers };
