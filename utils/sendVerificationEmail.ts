// utils/sendVerificationEmail.ts
import nodemailer from "nodemailer";

/**
 * Sends a verification email to the specified user with a verification link.
 *
 * @param user - An object containing the user's email and name.
 * @param url - The verification URL to be included in the email.
 *
 * @remarks
 * This function uses Nodemailer to send an email with both plain text and HTML content.
 * SMTP configuration is read from environment variables:
 * - `SMTP_HOST`
 * - `SMTP_PORT`
 * - `SMTP_AUTH_USER`
 * - `SMTP_AUTH_PASS`
 *
 * If an error occurs during the email sending process, it is logged to the console.
 */
export default function sendVerificationEmail(
  user: { 
    email: string, 
    name: string 
  }, 
  url: string
) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
      },
    });

    // Send mail
    transporter.sendMail({
      from: `"Auth" <${process.env.SMTP_AUTH_USER}>`,
      to: user.email,
      subject: "Verify your email address",
      text: `Click the link to verify your email: ${url}`,
      html: `<p><a href=${url} target="_blank">Click here to verify your email</a></p>`,
    });

    // Close the transporter
    transporter.close();
    return;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return;
  }
}