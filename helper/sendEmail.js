const nodemailer = require('nodemailer');
const sendMail = async (options)=>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL, 
          pass: process.env.SMTP_PASSWORD
        }
      });
    try {
        const msg = await transporter.sendMail(options);
    } catch (err) {
       
        console.log(err)
    }
}
module.exports = sendMail;