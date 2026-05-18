const Study = require('../models/studies.model');
const uploadToGCS = require("../utils/uploadToGCS");
const axios = require("axios");
// 📌 Create a new study

exports.createStudy = async (req, res) => {
  try {
    console.log("📩 Request body:", req.body);
    console.log("📂 Uploaded files:", req.files);
    console.log("REQ HEADERS:", req.headers["content-type"]);
    if (
      !req.files ||
      !req.files.image ||
      !req.files.file
    ) {
      return res.status(400).json({
        message: "Image and study file are required",
      });
    }

    // Upload image to Google Cloud Storage
    const imageUrl = await uploadToGCS(
      req.files.image[0],
      "study-images"
    );

    // Upload study file to Google Cloud Storage
    const fileUrl = await uploadToGCS(
      req.files.file[0],
      "study-files"
    );

    const study = new Study({
      userId: req.user._id,

      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      author: req.body.author,
      category: req.body.category,
      outline: req.body.outline,
      status: req.body.status,

      downloads: 0,

      image: imageUrl,

      filePath: fileUrl,

      fileType: req.files.file[0].mimetype,

      studyCompleted: true,
    });

    await study.save();

    console.log("✅ Study created successfully");

    res.status(201).json({
      message: "Study created successfully",
      study,
    });

  } catch (error) {
    console.error("❌ Create study error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 📌 Get all studies
exports.getAllStudies = async (req, res) => {
    try {
        const studies = await Study.find().populate('userId', 'username email'); // Fetch all studies, including creator's name & email
        res.status(200).json(studies);
    } catch (error) {
        console.error("Error fetching studies:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 Get a single study by ID
exports.getSingleStudyById = async (req, res) => {
    try {
        const study = await Study.findById(req.params.id)
        .populate('userId', 'firstname lastname email')
        .populate('comments.userId', 'username firstname lastname email image');
        console.log(study.comments);

        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }
        res.status(200).json(study);
    } catch (error) {
        console.error("Error fetching study:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 Update a study
exports.updateStudy = async (req, res) => {
  try {
    const study = await Study.findById(req.params.id);

    if (!study) {
      return res.status(404).json({
        message: "Study not found",
      });
    }

    // Check ownership
    if (study.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this study",
      });
    }

    // Update basic fields
    study.title =
      req.body.title || study.title;

    study.description =
      req.body.description || study.description;

    study.outline =
      req.body.outline || study.outline;

    study.date =
      req.body.date || study.date;

    study.author =
      req.body.author || study.author;

    study.category =
      req.body.category || study.category;

    study.status =
      req.body.status || study.status;

    // Upload new image if provided
    if (req.files?.image?.[0]) {
      const imageUrl = await uploadToGCS(
        req.files.image[0],
        "study-images"
      );

      study.image = imageUrl;
    }

    // Upload new study file if provided
    if (req.files?.file?.[0]) {
      const fileUrl = await uploadToGCS(
        req.files.file[0],
        "study-files"
      );

      study.filePath = fileUrl;

      study.fileType =
        req.files.file[0].mimetype;
    }

    await study.save();

    res.status(200).json({
      message: "Study updated successfully",
      study,
    });
  } catch (error) {
    console.error("❌ Update study error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 📌 Delete a study
exports.deleteStudy = async (req, res) => {
    try {
        const study = await Study.findById(req.params.id);

        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Check if the logged-in user is the owner of the study
        if (study.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this study" });
        }

        await Study.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Study deleted successfully" });

    } catch (error) {
        console.error("Error deleting study:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Add a comment
exports.addComment = async (req, res) => {
    try {
        console.log("Adding comment:", req.body);
        const { text } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const study = await Study.findById(req.params.id);
        if (!study) return res.status(404).json({ message: 'Sermon not found' });

        const commenterName = req.user.isAdmin ? "Admin" : req.user.username;

        const comment = {
            userId: req.user.id,
            name: commenterName,
            text,
            createdAt: new Date()
        };

        study.comments.push(comment);
        await study.save();

        console.log("Comment added successfully:", comment);
        res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        console.log("Received delete comment request:", req.params);
        
        let { studyId, commentId } = req.params;
        studyId = studyId.trim();
        commentId = commentId.trim();

        if (!mongoose.Types.ObjectId.isValid(studyId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            console.error("Invalid ID format");
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const study = await Study.findById(studyId);
        if (!study) return res.status(404).json({ message: "Sermon not found" });

        const commentIndex = study.comments.findIndex(c => c._id.toString() === commentId);
        if (commentIndex === -1) {
            console.error("Comment not found");
            return res.status(404).json({ message: "Comment not found" });
        }

        study.comments.splice(commentIndex, 1);
        await study.save();

        console.log("Comment deleted successfully");
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.reactToStudy = async (req, res) => {
    try {
        const { id } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id;

        if (!emoji) {
            return res.status(400).json({ message: "Reaction emoji is required" });
        }

        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Remove user's previous reaction
        study.reactions.forEach((reaction) => {
            reaction.users = reaction.users.filter((user) => user.toString() !== userId);
        });

        // Check if the new reaction emoji exists
        let reaction = study.reactions.find((r) => r.emoji === emoji);

        if (!reaction) {
            // If emoji doesn't exist in reactions, create a new one
            reaction = { emoji, users: [userId] };
            study.reactions.push(reaction);
        } else {
            // Add user to the new reaction
            reaction.users.push(userId);
        }

        // Remove empty reaction objects
        study.reactions = study.reactions.filter((r) => r.users.length > 0);

        await study.save();

        res.status(200).json({ message: "Reaction updated", reactions: study.reactions });
    } catch (error) {
        console.error("Error updating reactions:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getStudyReactions = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Find the reaction made by the current user
        let userReaction = null;
        for (const reaction of study.reactions) {
            if (reaction.users.includes(userId)) {
                userReaction = reaction.emoji;
                break;
            }
        }

        res.status(200).json({ userReaction, reactions: study.reactions });
    } catch (error) {
        console.error("Error fetching reactions:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.findUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Validate email format
        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return only the user ID
        res.status(200).json({ userId: user._id });
    } catch (error) {
        console.error("Error finding user by email:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.markStudyCompleted = async (req, res) => {
    try {
        const { id } = req.params; // Study ID
        const userId = req.user.id;

        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Add user to completedBy list if not already there
        if (!study.completedBy.includes(userId)) {
            study.completedBy.push(userId);
            study.markModified("completedBy"); // Ensure changes are registered
        }

        // Remove from readingBy (because it's now completed)
        study.readingBy = study.readingBy.filter(user => user.toString() !== userId);
        study.markModified("readingBy");

        await study.save();
        res.status(200).json({ message: "Study marked as completed", study });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Controller to get completed studies
exports.getMarkStudyCompleted = async (req, res) => {
    try {
        const userId = req.user?.id;

        console.log("Logged-in User ID:", userId);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user ID found"
            });
        }

        const completedStudies = await Study.find({
            completedBy: userId
        });

        console.log("Completed Studies:", completedStudies);

        // ✅ Return empty array instead of 404
        if (completedStudies.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(completedStudies);

    } catch (error) {
        console.error("Error fetching completed studies:", error);

        res.status(500).json({
            message: "Error fetching completed studies",
            error: error.message
        });
    }
};



exports.markStudyInProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Add user to readingBy if not already there
        if (!study.readingBy.includes(userId)) {
            study.readingBy.push(userId);
        }

        await study.save();
        res.status(200).json({ message: "Study marked as in-progress", study });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getMarkStudyInProgress = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user ID found"
            });
        }

        // Fetch studies where the user has started but not completed
        const inProgressStudies = await Study.find({
            readingBy: userId,
            completedBy: { $ne: userId }
        });

        // ✅ Return empty array instead of 404
        if (inProgressStudies.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(inProgressStudies);

    } catch (error) {
        console.error("Error fetching in-progress studies:", error);

        res.status(500).json({
            message: "Error fetching in-progress studies",
            error: error.message
        });
    }
};



exports.trackStudyDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Add user to downloadedBy list if not already there
        if (!study.downloadedBy.includes(userId)) {
            study.downloadedBy.push(userId);
            study.downloads += 1; // Increase download count
        }

        await study.save();
        res.status(200).json({ message: "Download tracked", study });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getStudyToDownload = async (req, res) => {
    try {
        const study = await Study.findById(req.params.id);
        if (!study) return res.status(404).json({ message: "Study not found" });

        const response = await axios.get(study.filePath, {
            responseType: "stream",
        });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${study.title}.pdf"`
        );
        res.setHeader("Content-Type", "application/pdf");

        response.data.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Download failed", error: error.message });
    }
};

exports.getUserDownloads = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all studies where the user is in the downloadedBy array
        const downloadedStudies = await Study.find({
            downloadedBy: userId
        });

        // ✅ Return empty array instead of 404
        if (downloadedStudies.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(downloadedStudies);

    } catch (error) {
        console.error("Error fetching downloaded studies:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const completedStudies = await Study.find({ completedBy: userId }).select(`
        title
        author
        category
        image
        description
        outline
        date
        downloads
        `);
        // Ensure only in-progress studies (not completed) are fetched
        const inProgressStudies = await Study.find({ 
            readingBy: userId, 
            completedBy: { $ne: userId }  // Exclude completed studies
        }).select(`
            title
            author
            category
            image
            description
            outline
            date
            downloads
            `);

        const downloadedStudies = await Study.find({ downloadedBy: userId }).select(`
            title
            author
            category
            image
            description
            outline
            date
            downloads
            `);
        // Explicitly mark modified fields to ensure Mongoose tracks changes properly
        completedStudies.forEach(study => study.markModified("completedBy"));
        inProgressStudies.forEach(study => study.markModified("readingBy"));

        res.status(200).json({
            completed: completedStudies,
            inProgress: inProgressStudies,
            downloaded: downloadedStudies
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.getPlatformStatistics = async (req, res) => {
  try {
    const stats = await Study.aggregate([
      // 1. Project required fields
      {
        $project: {
          totalComments: { $size: "$comments" },
          totalReactions: { $size: { $ifNull: ["$reactions", []] } },
          totalDownloads: "$downloads",
          isCompleted: { $gt: [{ $size: "$completedBy" }, 0] },
          isReading: { $gt: [{ $size: "$readingBy" }, 0] },
          completedBy: 1,
          readingBy: 1,
          comments: 1,
        },
      },

      // 2. Flatten comments
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 3. Filter valid comments
      {
        $match: {
          "comments.text": { $exists: true, $ne: "" },
        },
      },

      // 4. Populate user
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "comments.user",
        },
      },

      // 5. Flatten user array
      {
        $addFields: {
          "comments.user": { $arrayElemAt: ["$comments.user", 0] },
        },
      },

      // 6. Group everything back
      {
        $group: {
          _id: null,
          totalStudies: { $sum: 1 },
          totalComments: { $sum: 1 },
          totalReactions: { $sum: "$totalReactions" },
          totalDownloads: { $sum: "$totalDownloads" },
          totalCompleted: { $sum: { $cond: ["$isCompleted", 1, 0] } },
          totalOngoing: { $sum: { $cond: ["$isReading", 1, 0] } },

          allComments: { $push: "$comments" },
          allCompletedBy: { $push: "$completedBy" },
          allReadingBy: { $push: "$readingBy" },
        },
      },

      // 7. Sort comments by latest
      {
        $addFields: {
          allComments: {
            $sortArray: {
              input: "$allComments",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
    ]);

    res.status(200).json(
      stats[0] || {
        totalStudies: 0,
        totalComments: 0,
        totalReactions: 0,
        totalDownloads: 0,
        totalCompleted: 0,
        totalOngoing: 0,
        allComments: [],
        allCompletedBy: [],
        allReadingBy: [],
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
