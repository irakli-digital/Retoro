import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  console.warn("Mailgun credentials not found in environment variables.");
}

export const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: process.env.MAILGUN_URL || 'https://api.mailgun.net',
});

export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';
export const EMAIL_FROM = `Retoro <noreply@${MAILGUN_DOMAIN}>`;

export async function sendVerificationEmail(to: string, verificationLink: string) {
  try {
    const result = await mg.messages.create(MAILGUN_DOMAIN, {
      from: EMAIL_FROM,
      to: [to],
      subject: "Verify your email for Retoro",
      text: `Welcome to Retoro! Please verify your email by clicking the following link: ${verificationLink}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Retoro!</h2>
          <p>Please verify your email address to complete your registration.</p>
          <p>
            <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email
            </a>
          </p>
          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link into your browser: <br>
            ${verificationLink}
          </p>
        </div>
      `
    });
    console.log("Verification email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  try {
    const result = await mg.messages.create(MAILGUN_DOMAIN, {
      from: EMAIL_FROM,
      to: [to],
      subject: "Log in to Retoro",
      text: `Click this link to log in to Retoro: ${magicLink}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Log in to Retoro</h2>
          <p>Click the button below to sign in to your account.</p>
          <p>
            <a href="${magicLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Log In
            </a>
          </p>
          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link into your browser: <br>
            ${magicLink}
          </p>
        </div>
      `
    });
    console.log("Magic link email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending magic link email:", error);
    throw error;
  }
}
