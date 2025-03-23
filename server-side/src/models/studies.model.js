const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, default: '' },
    outline: { type: String, required: true },
    filePath: { type: String, required: false }, // ✅ Stores the uploaded file's path
    fileType: { type: String, enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/epub+zip'], required: false }, // ✅ Ensures only valid file types are stored
    studyCompleted: { type: Boolean, default: false },
    author: { type: String, required: true },
    category: { type: String, required: true },
    downloads: { type: Number, default: 0 },
    status: { type: String, enum: [ 'Published', 'Draft', 'Pending', 'Approved', 'Rejected'], default: 'Published' },
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readingBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reactions: [
        {
            emoji: { type: String, required: true }, // Store emoji directly as a string
            users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users who reacted
        }
    ],
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Study = mongoose.model('Study', studySchema);
module.exports = Study;