import dotenv from "dotenv"
import nodemailer from "nodemailer";
dotenv.config();



interface MailPayload {
    to: string;
    userData: any;
    title: string;
    data: string;
    }

class mail{
  public async sendMail(payload:MailPayload){
   // console.log("hi")
    const transporter = nodemailer.createTransport({
        service: process.env.SMTPSERVICE,
        auth: {
          user: process.env.SMTPUSER,
          pass: process.env.SMTPPASSWORD,
        },
      });
       
      const mailOptions = {
        from: `XYZ Company Name ${process.env.SMTPUSER}`,
        to: payload?.to,
        subject:"Reset Password Mail",
        html:payload.data
        // html:`<b> Hello, User </b>
        // <p> You requested to reset your password. </p>
        // <p> Please, click the link below to reset your password. </p>`,

        //html:payload.data
        // html:
        // "<p>Hello " +
        //   "User" +
        // `, Please click here to <a href="http://localhost:3000/reset-password?token=${payload.data}` +
        // '"></br> Verify </a> your mail. </p>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return true;
        }
      });

  }
}

export default new mail();