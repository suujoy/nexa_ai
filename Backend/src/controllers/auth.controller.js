import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @route POST /api/auth/register
 * @access public
 */
export const registerController = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{ username }, { email }],
        });
        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: `User already exists with this ${isUserExist.email === email ? "email" : "username"}`,
            });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password,
        });

        const emailVerificationToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
        );

        await sendEmail({
            to: email,
            subject: "Verify your Nexa AI account",
            html: `<p>Hi ${user.name},</p>
                   <p>Click to verify your email:
                   <a href="https://nexa-ai-v1j9.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></p>`,
        });

        const safeUser = await userModel.findById(user._id).select("-password");
        res.status(201).json({
            success: true,
            message: "Registered. Please verify your email.",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route POST /api/auth/login
 * @access public
 */
export const loginController = async (req, res, next) => {
    try {
        const { identifier, username, email, password } = req.body;

        const value = identifier || email || username;

        const user = await userModel
            .findOne({
                $or: [{ username: value }, { email: value }],
            })
            .select("+password");

        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch)
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const safeUser = await userModel.findById(user._id).select("-password");

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/auth/get-me
 * @access private
 */
export const getMeController = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/auth/verify-email?token=
 * @access public
 */
export const verifyEmailController = async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(400).send("<h1>Token missing.</h1>");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).send("<h1>Invalid link.</h1>");

        if (user.verified) {
            return res.send(`<html><body style="text-align:center;padding-top:100px">
                <h1 style="color:#2563eb">Already Verified</h1>
                <a href="https://nexa-ai-v1j9.onrender.com/login">Go to Login</a>
            </body></html>`);
        }

        user.verified = true;
        await user.save();

        return res.send(`<html><body style="text-align:center;padding-top:100px">
            <h1 style="color:green">Email Verified!</h1>
            <a href="https://nexa-ai-v1j9.onrender.com/login">Go to Login</a>
        </body></html>`);
    } catch {
        return res.status(400).send("<h1>Invalid or expired link.</h1>");
    }
};

/**
 * @route POST /api/auth/resend-verify-email
 * @access public
 */
export const resendEmailController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res
                .status(400)
                .json({ success: false, message: "Email is required" });

        const user = await userModel.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        if (user.verified)
            return res
                .status(400)
                .json({ success: false, message: "Email already verified" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        await sendEmail({
            to: email,
            subject: "Verify your Nexa AI account",
            html: `<p>Hi ${user.name},</p>
                   <p><a href="https://nexa-ai-v1j9.onrender.com/api/auth/verify-email?token=${token}">Verify Email</a> (expires in 7 days)</p>`,
        });

        res.status(200).json({
            success: true,
            message: "Verification email sent.",
        });
    } catch (err) {
        next(err);
    }
};
