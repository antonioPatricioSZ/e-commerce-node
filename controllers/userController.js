import { User } from "../models/User.js";
import { createTokenJWT } from "../utils/jwt.js";

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "USER" }).select("-password");
  res.json(users);
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    checkPermissions(req.user, user._id);
    res.json(user);
  } catch (error) {
    return res.status(422).json({ message: "Id invalid." });
  }
};

const showCurrentUser = async (req, res) => {
  res.json(req.user);
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const userData = {};

  if (name) {
    userData.name = name;
  }

  if (email) {
    userData.email = email;
  }

  if (!name || !email) {
    return res.status(400).json({ message: "Informe os valores." });
  }

  const emailAlreadyExists = await User.findOne({ email: email });
  if (emailAlreadyExists) {
    return res.status(400).json({ message: "Please use another email" });
  }

  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, userData);

  const tokenUser = {
    userId: user._id,
  };

  const token = createTokenJWT({ payload: tokenUser });

  res.status(200).json({ token: token });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Informe os valores." });
  }
  const reqUser = req.user;

  const user = await User.findOne({ _id: reqUser.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Senha Errada." });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Success! Password Update." });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
