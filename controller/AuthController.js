const User = require('../model/User');
const parse = require('parse/node');
const forgetMyPassword = require('../smtp/forget-password');
const sendWelcomeEmail = require('../smtp/welcome');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');




exports.register = async (req, res) => {
    const { email, password, firstName, lastName, username, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const newUser = new User({ 
            email, 
            password, 
            firstName, 
            lastName, 
            username, 
            role, 
            avatar: '' 
        });

        if (req.file) {
            newUser.avatar = req.file.filename;
        }

        await newUser.save();

        await sendWelcomeEmail(newUser);

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            result: { id: newUser._id, email: newUser.email, name: newUser.displayName }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, email: user.email, name: user.displayName },
            token: token,
        });

    } catch (error) {
        console.error('Login error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
};

exports.logout = async (req, res) => {
    res.status(200).send('Logout successful');
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Update user with reset token and expiry
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        await forgetMyPassword(email);

        res.status(200).json({ message: "Password reset token sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.handleForgetPassword = async (req, res) => {
    try {
        await forgetMyPassword(req.body.email);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({ 
            resetToken: token, 
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user with new password and remove reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userData.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

