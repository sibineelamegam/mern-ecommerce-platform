// config/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Make sure .env is loaded

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // App Password from Google
  },
});

// Optional: verify connection at startup
transporter.verify()
  .then(() => console.log("SMTP Connected"))
  .catch(err => console.error("SMTP Error:", err));
