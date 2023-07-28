import { User } from "../models/User.js";
import { createTokenJWT } from "../utils/jwt.js";
import { sendEmailToRedefination } from "../utils/sendEmail.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(422).json({ message: "Email already exists." });
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "ADMIN" : "USER";

  const newUser = {
    name,
    email,
    password,
    role,
  };

  try {
    const user = await User.create(newUser);
    const tokenUser = {
      userId: user._id,
    };

    const token = createTokenJWT({ payload: tokenUser });

    return res.status(201).json({ token: token, role: user.role });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Please provide email and password." });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ message: "Usuário ou senha inválidos." });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(422).json({ message: "Usuário ou senha inválidos." });
  }

  const tokenUser = {
    userId: user._id,
    role: user.role
  };

  const token = createTokenJWT({ payload: tokenUser });
  // await sendEmailToRedefination({
  //   name: user.name,
  //   email: "souzapatricio798@gmail.com",
  // });

  return res.status(200).json({ token: token, role: user.role });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    HttpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ message: "User logged out!" });
};

export { register, login, logout };
