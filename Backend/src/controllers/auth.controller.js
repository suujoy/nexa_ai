import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @name registerController
 * @description register user
 * @route POST /api/auth/register
 * @access public
 * @body {name, username, email, password  }
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

        const emailVerificationToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
        );

        await sendEmail({
            to: email,
            subject: "Welcome to Nexa Ai Chatbot",
            text: `Verify your email to start using Nexa Ai Chatbot`,
            html: `<p>Hi ${user.name},</p>
                    <p>Verify your email to start using <strong>Nexa Ai Chatbot</strong>
                    <p>Please click on the link below to verify your email:
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></p>
                    <p>Thanks,<br>Nexa Ai Chatbot</p>
                    <P>This is an automatically generated email. Please do not reply.</P>
                    <P>Best regards,<br>Nexa Ai Chatbot</P>
           `,
        });

        const safeUser = await userModel.findById(user._id).select("-password");

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name loginController
 * @description login user
 * @route POST /api/auth/login
 * @access public
 * @body {username,email, password}
 */

export const loginController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await userModel
            .findOne({
                $or: [{ username: username }, { email: email }],
            })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                err: "User not found",
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                err: "Invalid password",
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email before login in",
                err: "Email not verified",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("token", token);

        const safeUser = await userModel.findById(user._id).select("-password");

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name getMeController
 * @description get current user
 * @route GET /api/auth/get-me
 * @access private
 */

export const getMeController = async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            err: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user,
    });
};

/**
 * @name verifyEmailController
 * @description verify user email
 * @route GET /api/auth/verify-email
 * @access public
 * @query {token}
 */
export const verifyEmailController = async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).send("Invalid verification link");
        }

        const verifiedHtml = `
        <html>
        <body style="font-family:Arial;text-align:center;padding-top:100px">
        <h1 style="color:green">Email Verified</h1>
        <p>Your email has been successfully verified.</p>
        <a href="http://localhost:5173/login">Go to Login</a>
        </body>
        </html>
        `;

        const alreadyVerifiedHtml = `
        <html>
        <body style="font-family:Arial;text-align:center;padding-top:100px">
        <h1 style="color:#2563eb">Email Already Verified</h1>
        <p>Your email is already verified.</p>
        <a href="http://localhost:5173/login">Go to Login</a>
        </body>
        </html>
        `;

        if (user.verified) {
            return res.send(alreadyVerifiedHtml);
        }

        user.verified = true;
        await user.save();

        return res.send(verifiedHtml);
    } catch (err) {
        return res.status(400).send("Invalid or expired verification link");
    }
};

/**
 * @name resendEmailController
 * @description resend email verification link
 * @route POST /api/auth/resend-email
 * @access public
 * @body {email}
 */
export const resendEmailController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
            err: "Email is required",
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            err: "User not found",
        });
    }

    if (user.verified) {
        return res.status(400).json({
            success: false,
            message: "Email already verified",
            err: "Email already verified",
        });
    }

    const emailVerificationToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    await sendEmail({
        to: email,
        subject: "Welcome to Nexa Ai Chatbot",
        text: `Verify your email to start using Nexa Ai Chatbot`,
        html: `<p>Hi ${user.name},</p>
                    <p>Verify your email to start using <strong>Nexa Ai Chatbot</strong>
                    <p>Please click on the link below to verify your email:
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></p>
                    <p>Thanks,<br>Nexa Ai Chatbot</p>
                    <P>This is an automatically generated email. Please do not reply.</P>
                    <P>Best regards,<br>Nexa Ai Chatbot</P>
           `,
    });

    res.status(200).json({
        success: true,
        message: "Email sent successfully",
    });
};
