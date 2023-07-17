import { User } from "../models/User.js"
import { attachCookiesToResponse } from "../utils/jwt.js"
import bcrypt from "bcryptjs"
import { sendEmailToRedefination } from "../utils/sendEmail.js"

const register = async (req, res) => {
   
   const { name, email, password } = req.body

   const emailAlreadyExists = await User.findOne({email})
   if(emailAlreadyExists) {
      return res.status(422).json({message: "Email already exists."})
   }

   const isFirstAccount = await User.countDocuments({}) === 0
   const role = isFirstAccount ? "admin" : "user"

   const newUser = {
      name,
      email,
      password,
      role
   }

   try {

      const user = await User.create(newUser)
      const tokenUser = {
         name: user.name,
         userId: user._id,
         role: user.role
      }

      attachCookiesToResponse({ res: res, user: tokenUser })
      
      return res.status(201).json({user: user})

   } catch (error) {
      console.log(error)
   }

}

const login = async (req, res) => {
   const { email, password } = req.body
   console.log(req.body);
   console.log("user: " + req.user);

   if(!email || !password) {
      return res.status(422).json({message: "Please provide email and password."})
   }

   const user = await User.findOne({ email: email })
   console.log(user)

   if(!user) {
      return res.status(422).json({message: "Invalid credentials."})
   }

   const isPasswordCorrect = await user.comparePassword(password)
   
   if(!isPasswordCorrect) {
      return res.status(422).json({message: "Invalid credentials."})
   }

   const tokenUser = {
      name: user.name,
      userId: user._id,
      role: user.role
   }

   attachCookiesToResponse({ res: res, user: tokenUser })
   await sendEmailToRedefination({
      name: user.name,
      email: "souzapatricio798@gmail.com"
   })
   
   return res.status(200).json({ message: "Tudo Ok!" })

}

const logout = async (req, res) => {
   res.cookie("token", "logout", {
      HttpOnly: true,
      expires: new Date(Date.now() + 1000)
   })
   res.status(200).json({message: "User logged out!"})
}


export {
   register,
   login,
   logout
}