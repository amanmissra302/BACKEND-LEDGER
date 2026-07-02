const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "🎉 Welcome to Backend Ledger!";

  const text = `
Hi ${name},

Welcome to Backend Ledger! 🎉

We're excited to have you on board.

With Backend Ledger, you can:
• Manage your accounts securely
• Track transactions
• Maintain your financial records efficiently

Your account has been created successfully.

If you have any questions or need assistance, feel free to reach out to us.

Happy Banking!

Regards,
Backend Ledger Team
  `;

  await sendEmail(userEmail, subject, text);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successful";

    const text = `Hello ${name},

Your transaction of ₹${amount} to account ${toAccount} was successful.

Thank you for using Backend Ledger.`;

    const html = `
        <p>Hello ${name},</p>
        <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> was successful.</p>
        <p>Thank you for using <b>Backend Ledger</b>.</p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailedEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed";

    const text = `Hello ${name},

Your transaction of ₹${amount} to account ${toAccount} failed.

Please try again later.`;

    const html = `
        <p>Hello ${name},</p>
        <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> <span style="color:red;">failed</span>.</p>
        <p>Please try again later.</p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailedEmail,
}