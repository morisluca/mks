import nodemailer from "nodemailer";
import { db, siteSettingsTable } from "../db/index.js";
import { logger } from "./logger.js";

const defaultSiteSettings = {
    siteEmail: process.env.EMAIL_FROM || "no-reply@captrustmarkets.com",
    emailNotificationsEnabled: false,
};
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const secure = process.env.SMTP_SECURE === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !port || !user || !pass) {
        logger.warn("SMTP is not fully configured. Email notifications will be skipped.");
        return null;
    }

  // mailrog
  transporter = nodemailer.createTransport({
      host: "localhost",
      port: 2525,
      secure: false
  });

  return transporter;

  transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
          user,
          pass,
      },
  });

  return transporter;
}

export async function getSiteEmail() {
    try {
        const [settings] = await db
            .select({ siteEmail: siteSettingsTable.siteEmail })
            .from(siteSettingsTable);
        return settings?.siteEmail || defaultSiteSettings.siteEmail;
    }
    catch (error) {
        logger.warn({ err: error }, "Unable to read site email from settings; using default sender.");
        return defaultSiteSettings.siteEmail;
    }
}
export async function getsiteName() {
    try {
        const [settings] = await db
            .select({ siteName: siteSettingsTable.siteName })
            .from(siteSettingsTable);
        return settings?.siteName || "our site";
    }
    catch (error) {
        logger.warn({ err: error }, "Unable to read site email from settings; using default sender.");
        return "our site";
    }
}
export async function getsiteNameCurrency() {
    try {
        const [settings] = await db
            .select({ currency: siteSettingsTable.currency })
            .from(siteSettingsTable);
        return settings?.currency || "usd";
    }
    catch (error) {
        logger.warn({ err: error }, "Unable to read site email from settings; using default sender.");
        return "usd";
    }
}
async function getEmailNotificationsEnabled() {
    if (!getTransporter())
        return false;
    try {
        const [settings] = await db
            .select({ emailNotificationsEnabled: siteSettingsTable.emailNotificationsEnabled })
            .from(siteSettingsTable);
        return Boolean(settings?.emailNotificationsEnabled);
    }
    catch (error) {
        logger.warn({ err: error }, "Unable to read email notification setting; defaulting to false.");
        return false;
    }
}
export async function sendNotificationEmail(to, subject, text, html) {
    const transport = getTransporter();
    if (!transport) {
        return;
    }
    const SmtpAddress = process.env.SMTP_USER;
    const AdminAddress = await getSiteEmail();
    try {
        await transport.sendMail({
            from: SmtpAddress,
            to,
            subject,
            text,
            html,
        });
    }
    catch (error) {
        logger.error({ err: error }, "Failed to send notification email");
    }
}
export async function shouldSendEmailNotifications() {
    return getEmailNotificationsEnabled();
}



// Email Notification templates
export function loginEmailTemp(sitename, userFullName) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          ${sitename} Login Notification
        </div>
      
        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>${userFullName}</strong>,</p>
      
          <p>You have successfully logged in to your <strong>${sitename}</strong> account.</p>
      
          <div style="margin:20px 0;padding:15px;background:#fff4f4;border-left:4px solid #ef4444;border-radius:4px;color:#b91c1c;font-size:14px;">
            If this login wasn’t you, please contact support immediately.
          </div>
      
          <p>Best regards,<br>${sitename} Team</p>
        </div>
      
        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>
      
      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}
export function registerEmailTemp(sitename, userFullName) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Account Registration Notification
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>${userFullName}</strong>,</p>

          <p>Thank you for registering with us. Your account has been successfully created on <strong>${sitename}</strong>.</p>

          <div style="margin:20px 0;padding:15px;background:#ecfdf5;border-left:4px solid #10b981;border-radius:4px;color:#065f46;font-size:14px;">
            You can log in to your account using your registered credentials.
          </div>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}

export function resetPasswordEmailTemp(sitename, userFullName, resetLink) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Password Reset Request
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>${userFullName}</strong>,</p>

          <p>We received a request to reset your password for your <strong>${sitename}</strong> account.</p>

          <p style="margin:20px 0;text-align:center;"><a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#ffffff;border-radius:8px;text-decoration:none;">Reset Password</a></p>

          <p>If you did not request a password reset, you can safely ignore this email.</p>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("resetPasswordEmailTemp " + error);
        return;
    }
}
export function DepostAdminEmailTemp(sitename, userID, amount, currency, defCurr) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Deposit Request Received
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>Admin</strong>,</p>

          <p>User with the id <strong>${userID}</strong> have made a deposit of <strong>${defCurr} ${amount} in ${currency}</strong> kindly review and process the pending deposit</p>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}
export function DepostUserApproveEmailTemp(sitename, userFullName, amount, currency) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Deposit Approved Notification
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>${userFullName}</strong>,</p>

          <p>Your deposit for <strong>${currency} ${parseFloat(amount)} </strong> has been approved and credited to your balance.</p>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}
export function withdrawalAdminEmailTemp(sitename, userID, amount, currency, defCurr) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Deposit Request Received
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>Admin</strong>,</p>

          <p>User with the id <strong>${userID}</strong> have requested a withdrawal of <strong>${defCurr} ${amount} in ${currency}</strong> kindly review and process the pending withdrawal</p>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}

export function withdrawalUserApproveEmailTemp(sitename, userFullName, amount, currency) {
    try {
        return `
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <div style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
          Withdrawal Approved Notification
        </div>

        <div style="padding:30px 20px;color:#333;line-height:1.6;">
          <p>Hello <strong>${userFullName}</strong>,</p>

          <p>Your withdrawal for <strong>${currency} ${parseFloat(amount)} </strong> has been approved and sent to your wallet.</p>

          <p>Best regards,<br>${sitename} Team</p>
        </div>

        <div style="padding:15px 20px;font-size:12px;color:#888;text-align:center;background:#fafafa;">
          © ${new Date().getFullYear()} ${sitename}. All rights reserved.
        </div>

      </div>
    `;
    }
    catch (error) {
        console.log("loginEmailTemp " + error);
        return;
    }
}
