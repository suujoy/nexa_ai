import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * registerController
 */
export const registerController = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: `User already exist with this ${isUserExist.email ? "email" : "username"}`,
            });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password,
        });

        await sendEmail({
            to: email,
            subject: "Welcome to Nexa Ai Chatbot",
            text: `Verify your email to start using Nexa Ai Chatbot`,
            html: `<p>Hi ${user.name},</p>
                    <p>Verify your email to start using <strong>Nexa Ai Chatbot</strong>
                    <a href="http://localhost:3000/verify/${user.email}">Verify Email</a></p>
                    <p>Thanks,<br>Nexa Ai Chatbot</p>
                    <P>This is an automatically generated email. Please do not reply.</P>
                    <P>Best regards,<br>Nexa Ai Chatbot</P>
           `,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        next(err);
    }
};
