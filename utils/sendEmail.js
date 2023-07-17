
import { createTransport } from "nodemailer"

export const sendEmailToRedefination = async ({ id = 0, email, name, forgotPasswordToken = "" }) => {

   let transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: "patriciozebra3@gmail.com",
         pass: "vgbnefrbbaiiwcso"
      }
   })
   
   // const urlForgotPassword = `${origin}/reset-password/?id=${id}&forgotPasswordToken=${forgotPasswordToken}`

   //  const message = `<p>Ao clicar no link você será direcionado para uma nova página onde irá atualizar sua senha. <a href=${urlForgotPassword}> Clique Aqui para atualizar!</a></p>`

   let options = {
      from: "Patricio souza <patriciozebra3@gmail.com>",
      to: email,
      subject: "Recuperação de senha",
      text: `Olá, ${name}, para redefinir a senha clique aqui!`
   }
   
   return transporter.sendMail(options)

}

