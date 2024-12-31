import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  // debug: true,
  // logger: true,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = (emailData: {
  to: string;
  subject: string;
  text: string;
}) => {
  console.log(process.env.EMAIL, "email");
  console.log(emailData, "email");
  const { to, subject, text } = emailData;
  const mailInfo = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };
  transporter.sendMail(mailInfo, (err, info) => {
    if (err) {
      throw new Error("Error sending email!");
    } else {
      return;
    }
  });
};
