import { User } from "../models/User.js";

export const authRole = (role) => {
  return async (req, res, next) => {
    const { userId } = req.user;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Você não possui autorização!" });
    }
    next();
  };
};
