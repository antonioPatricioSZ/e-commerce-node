import { isTokenValidate } from '../utils/jwt.js'

export const authenticateUser = (req, res, next) => {

   const bearer = req.headers.authorization
   console.log(req.headers)
   if(!bearer) {
      return res.status(401).json({ message: "Authentication Invalid." })
   }

   const token = bearer.split(" ")[1]

   try {
      const { userId } = isTokenValidate({ token: token})
      req.user = { userId }
      next()
   } catch (error) {
      return res.status(401).json({ message: "Authentication invalid." })
   }
}

export const authorizePermissions = (...roles) => {
   return  (req, res, next) => {
      if(!roles.includes(req.user.role)) {
         return res.status(403).json({ message: "Unauthorized to access this route" })
      }
      next()
   }
}
