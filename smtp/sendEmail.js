const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.titan.email', // Titan's SMTP server
        port: 587, // SMTP port (commonly 587 for TLS)
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD  
        },
        tls: {
            // Do not fail on invalid certs (if needed)
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

module.exports = sendEmail;
