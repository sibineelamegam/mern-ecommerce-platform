const isProduction = process.env.NODE_ENV === "production";

const logout = (req, res) => {
  // Clear both cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

export default logout;
