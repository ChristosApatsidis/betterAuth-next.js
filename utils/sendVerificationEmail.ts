// utils/sendVerificationEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

/**
 * Sends a verification email to the specified user with a verification link.
*/
export default function sendVerificationEmail(
  user: { 
    email: string, 
    name: string 
  }, 
  url: string
) {
  try {
    resend.emails.send({
      from: `Christos Apatsidis <${process.env.SMTP_HOST}>`,
      to: user.email,
      subject: "Verify your email address",
      text: `Click the link to verify your email: ${url}`,
      html: `<p><a href=${url}>Click here to verify your email</a></p>`,
    });
    return;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return;
  }
}