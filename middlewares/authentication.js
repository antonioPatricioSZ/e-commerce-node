import { isTokenValidate } from '../utils/jwt.js'

export const authenticateUser = (req, res, next) => {

   const token = req.signedCookies.token
   console.log(req.signedCookies)
   console.log("token: " + token)
   if(!token) {
      return res.status(401).json({ message: "Authentication Invalid." })
   }
   try {
      const { name, userId, role } = isTokenValidate({ token: token})
      req.user = { name, userId, role }
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
