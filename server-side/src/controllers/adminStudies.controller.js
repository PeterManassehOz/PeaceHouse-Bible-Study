const Study = require('../models/studies.model');
const uploadToGCS = require("../utils/uploadToGCS");
const mongoose = require('mongoose');
const User = require('../models/users.model');

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



// ✅ Mark a study as completed or not (Admin/Author only)
exports.studyCompleted = async (req, res) => {
    try {
        const { id } = req.params; // Get study ID from request params
        const { studyCompleted } = req.body; // Get new completion status from request body

        // Validate studyCompleted is a boolean
        if (typeof studyCompleted !== "boolean") {
            return res.status(400).json({ message: "studyCompleted must be true or false." });
        }

        // Find the study by ID
        const study = await Study.findById(id);
        if (!study) {
            return res.status(404).json({ message: "Study not found" });
        }

        // Update study completion status
        study.studyCompleted = studyCompleted;
        await study.save();

        res.status(200).json({
            message: `Study marked as ${studyCompleted ? "completed" : "not completed"}.`,
            study
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.getUserActivityByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        console.log("Admin fetching activities for user:", id); // Debugging step

        const inProgressStudies = await Study.find({ readingBy: id }).select(`
        title
        author
        category
        image
        description
        outline
        date
        downloads
        `);
        const completedStudies = await Study.find({ completedBy: id }).select(`
        title
        author
        category
        image
        description
        outline
        date
        downloads
        `);
        const downloadedStudies = await Study.find({ downloadedBy: id }).select(`
        title
        author
        category
        image
        description
        outline
        date
        downloads
        `);

        res.status(200).json({ inProgress: inProgressStudies, completed: completedStudies, downloaded: downloadedStudies });
    } catch (error) {
        console.error("Error fetching user activities by admin:", error.message); // Debugging
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

