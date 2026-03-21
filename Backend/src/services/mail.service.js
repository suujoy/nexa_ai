// import nodemailer from "nodemailer";

// /**
//  * creating connection between SMTP server and your web server
//  */
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         type: "OAuth2",
//         user: process.env.GOOGLE_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     },
// });

// /**
//  * Veryfing transporter
//  */
// transporter
//     .verify()
//     .then(() => {
//         console.log(`Email transporter is ready to send email`);
//     })
//     .catch((err) => {
//         console.error(`Email transporter verification failed`, err);
//     });

// /**
//  * send Email Function
//  */
// export const sendEmail = async ({ to, subject, text, html }) => {
//     const mailOptions = {
//         from: process.env.GOOGLE_USER,
//         to,
//         subject,
//         html,
//         text,
//     };

//     const details = await transporter.sendMail(mailOptions);
//     console.log(details);
// };



// Uses Brevo HTTP API (not SMTP) — works on Render free tier
export const sendEmail = async ({ to, subject, text, html }) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: { name: "Nexa AI", email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: to }],
            subject,
            htmlContent: html,
            textContent: text,
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Brevo API error: ${err.message}`);
    }

    console.log("✅ Email sent to", to);
};