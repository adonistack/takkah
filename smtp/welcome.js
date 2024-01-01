const sendEmail = require('./sendEmail');

const emailStyles = `
    <style>
        .header {
            color: #333;
            font-family: Arial, sans-serif;
        }
        .content {
            color: #555;
            font-family: Arial, sans-serif;
        }
    </style>
`;

async function sendWelcomeEmail(user) {
    let subject, htmlContent;

    switch (user.role) {
        case 'store':
            subject = 'Welcome New Store';
            htmlContent = `
                <h1 class="header">Welcome to Our Platform</h1>
                <p class="content">We're excited to have you as a new store partner!</p>`;
            break;
        case 'employee':
            subject = 'Welcome New Employee';
            htmlContent = `
                <h1 class="header">Welcome Aboard</h1>
                <p class="content">We're thrilled to welcome you to our team!</p>`;
            break;
        default:
            // Default case if needed
            subject = 'Welcome!';
            htmlContent = `<h1 class="header">Welcome to Our Platform</h1>`;
    }

    // Combine HTML and CSS
    const htmlMessage = `${emailStyles}<div>${htmlContent}</div>`;

    // Send email
    await sendEmail({
        to: user.email,
        subject: subject,
        html: htmlMessage
    });
}

module.exports = sendWelcomeEmail;
