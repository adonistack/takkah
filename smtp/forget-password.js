const User = require('../model/User');
const sendEmail = require('./sendEmail'); // Assuming you have a sendEmail function in smtp folder

async function forgetMyPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    // Generate a reset token (this is a simplified version)
    const resetToken = Math.random().toString(36).substr(2);

    // Save the token and its expiry in the user model (add these fields in your User model)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Email content
    const resetUrl = `http://yourfrontend.com/reset-password?token=${resetToken}`;
    const message = `Please click on the following link to reset your password: ${resetUrl}`;

    // Send email
    await sendEmail({
        to: email,
        subject: 'Password Reset',
        text: message,
        html: `<p>Please click on the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    });
}

module.exports = forgetMyPassword;
