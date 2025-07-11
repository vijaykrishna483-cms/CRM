// Controllers/Gmail/sendMail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

/**
 * Sends an email using the configured transporter.
 * @param {Object} mailOptions - { to, subject, text, html }
 * @returns {Promise<Object>} - Info about the sent email.
 */
export const sendMail = ({ to, subject, text, html }) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `"Smart CRM" <${process.env.BREVO_USER}>`,
        to,
        subject,
        text,
        html
      },
      (err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      }
    );
  });
};
