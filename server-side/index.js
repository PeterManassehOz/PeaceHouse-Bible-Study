const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT;
const path = require("path");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data (text fields)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Corrected the protocol
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));
app.use("/uploads/files", express.static(path.join(__dirname, "uploads/files")));
app.use("/uploads/others", express.static(path.join(__dirname, "uploads/others")));
app.use("/uploads/ebooks", express.static(path.join(__dirname, "uploads/ebooks")));




const userRoutes = require('./src/routes/users.route');
const authRoutes = require('./src/routes/auth.route');
const studyRoutes = require('./src/routes/studies.route');
const adminRoutes = require('./src/routes/admin.route');
const newsletterRoutes = require("./src/routes/newsletter.route");



app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/studies', studyRoutes);
app.use('/admin', adminRoutes);
app.use('/newsletter', newsletterRoutes);

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
        res.send('PHouse Bible study server is running!');
    });
}

main().then(() => console.log('Connected to DB')).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});