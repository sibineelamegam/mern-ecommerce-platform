import User from "../../models/User.js";

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // hashed automatically by pre-save

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateProfile;
