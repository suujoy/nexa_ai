import nodemailer from "nodemailer";

/**
 * creating connection between SMTP server and your web server
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

/**
 * Veryfing transporter
 */
transporter
    .verify()
    .then(() => {
        console.log(`Email transporter is ready to send email`);
    })
    .catch((err) => {
        console.error(`Email transporter verification failed`, err);
    });

/**
 * send Email Function
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOptions);
    console.log(details);
};
