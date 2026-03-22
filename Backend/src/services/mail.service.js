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
