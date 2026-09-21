const getResetEmailTemplate = (userName, resetLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            
            <!-- Header Branding -->
            <tr>
              <td style="padding: 32px 32px 16px 32px; text-align: left;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background-color: #2563eb; color: #ffffff; font-weight: 900; font-size: 20px; width: 36px; height: 36px; border-radius: 8px; text-align: center; vertical-align: middle;">
                      f
                    </td>
                    <td style="padding-left: 12px; font-size: 20px; font-weight: 700; color: #ffffff; tracking-wide;">
                      facebook
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 16px 32px 32px 32px;">
                <h1 style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0;">
                  Reset Your Password
                </h1>
                <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; margin: 0 0 24px 0;">
                  Hi <strong style="color: #e5e7eb;">${userName}</strong>,<br>
                  We received a request to reset your password. Click the button below to choose a new password. This link will expire in <strong>5 minutes</strong>.
                </p>

                <!-- CTA Button -->
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                      <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #2563eb;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0 0 16px 0;">
                  If you didn't request a password reset, you can safely ignore this email. Your password won't change until you access the link above.
                </p>

                <!-- Direct Link Fallback -->
                <p style="font-size: 11px; color: #4b5563; word-break: break-all; margin: 0;">
                  If the button doesn't work, copy and paste this URL into your browser:<br>
                  <a href="${resetLink}" style="color: #3b82f6; text-decoration: underline;">${resetLink}</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #0f172a; padding: 20px 32px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="font-size: 11px; color: #6b7280; margin: 0;">
                  &copy; ${new Date().getFullYear()} Facebook Clone, Inc. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

module.exports = getResetEmailTemplate;