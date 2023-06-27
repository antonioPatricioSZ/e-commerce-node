
export const checkPermissions = (requestUser, resourceId, res) => {

   if(requestUser.role === "admin") {
      return
   }

   if(requestUser.userId === resourceId.toString()) {
      return
   }

   return res.status(403).json({ message: "Unauthorized to access this route" })

}