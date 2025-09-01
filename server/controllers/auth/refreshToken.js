import jwt from "jsonwebtoken";
import User from "../../models/User.js"; // adjust path

const isProduction = process.env.NODE_ENV === "production";

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token" });

        // Fetch user from DB
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Create new access token
        const newAccessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "None" : "Lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Exclude password before sending
        const { password: _, ...userData } = user.toObject();

        res.status(200).json({
          message: "Access token refreshed",
          user: userData, // name, email, role, etc.
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default refreshToken;
