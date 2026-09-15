const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {

        const info = await transporter.sendMail({
            from: `"Newsmania" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email sent:", info.messageId);

        return info;

    } catch (error) {
        console.log("Email sending failed:", error);
        throw error;
    }
};

module.exports = {
    sendEmail
};