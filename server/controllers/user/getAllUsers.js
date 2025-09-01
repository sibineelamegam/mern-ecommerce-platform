import User from "../../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getAllUsers;
