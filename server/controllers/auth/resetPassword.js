// controllers/auth/resetPassword.js
import crypto from "crypto";
import User from "../../models/User.js";

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    // Hash the received token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Set new password (pre-save hook handles hashing)
    user.password = password;

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    next(error);
  }
};

export default resetPassword;
