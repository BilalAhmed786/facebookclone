const nodemailer = require('nodemailer');

/**
 * Reusable utility function to send emails
 * @param {Object} options - Email parameters
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text version of email
 * @param {string} options.html - HTML content of email
 */
const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define mail options
  const mailOptions = {
    from: `"Facebook Security" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.text || '',
    html: options.html,
  };

  // 3. Send email
  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;