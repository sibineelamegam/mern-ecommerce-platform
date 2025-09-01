import User from "../../models/User.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Create access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,  
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );

    // Send both tokens as secure cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Exclude password and send remaining info
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

export default login;
