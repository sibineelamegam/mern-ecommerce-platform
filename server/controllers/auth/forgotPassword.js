// controllers/auth/forgotPassword.js
import crypto from "crypto";
import User from "../../models/User.js";
import { transporter } from "../../config/email.js";

// import dotenv from 'dotenv';
// dotenv.config();

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token and expiry on the user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create password reset URL (send the raw token via email)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Email options
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    next(error);
  }
};

export default forgotPassword;
