const Admin = require('../models/admin.model');
const { verifyPassword, generateToken, hashPassword } = require('../utils/generateTokenPassword');




// @desc Register Chief Admin
// @route POST /api/admin/register-chief
// @access Public (Only for the first time)
exports.registerChiefAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingChief = await Admin.findOne({ isChiefAdmin: true });
        if (existingChief) {
            return res.status(400).json({ message: "A Chief Admin already exists." });
        }

        const hashedPassword = await hashPassword(password);

        const chiefAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: true,
            isChiefAdmin: true,
        });

        const token = generateToken(chiefAdmin);

        res.status(201).json({
            name: chiefAdmin.name,
            email: chiefAdmin.email,
            isAdmin: chiefAdmin.isAdmin,
            isChiefAdmin: chiefAdmin.isChiefAdmin,
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc Admin login
// @route POST /api/admin/login
// @access Public
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await verifyPassword(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(admin);

        res.json({
            name: admin.name,
            email: admin.email,
            isAdmin: admin.isAdmin,
            isChiefAdmin: admin.isChiefAdmin,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Admin Signup (Pending Approval)
// @route POST /api/admin/signup
// @access Public (Anyone can sign up, but access is restricted)
exports.adminSignup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
            isChiefAdmin: false
        });

        res.status(201).json({
            message: "Admin registered successfully, awaiting approval from the Chief Admin.",
            name: newAdmin.name,
            email: newAdmin.email,
            isAdmin: newAdmin.isAdmin,
            isChiefAdmin: newAdmin.isChiefAdmin
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc Assign admin role
// @route PUT /api/admin/assign
// @access Private (Chief Admin Only)
exports.assignAdminRole = async (req, res) => {
    const { email } = req.body; // Email of the user to be promoted

    try {
        // Check if requester is a Chief Admin
        const requester = await Admin.findById(req.user.id);
        if (!requester || !requester.isChiefAdmin) {
            return res.status(403).json({ message: 'Access denied. Chief Admins only.' });
        }

        // Find the admin to promote
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the admin's role to admin
        admin.isAdmin = true;
        await admin.save();

        res.json({ message: 'The admin has been granted admin privileges.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};