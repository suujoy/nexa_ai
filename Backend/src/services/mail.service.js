import nodemailer from "nodemailer";

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

transporter.verify()
    .then(() => console.log("Email transporter ready"))
    .catch((err) => console.error("Email transporter failed:", err));

export const sendEmail = async ({ to, subject, text, html }) => {
    await transporter.sendMail({ from: process.env.GOOGLE_USER, to, subject, text, html });
};
