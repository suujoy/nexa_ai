import redis from "../configs/cache.js";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
                error: "User already exist",
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
                _id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
        );

        const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

        await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: `
    <div style="font-family:Arial;background:#f3f4f6;padding:30px;">
        <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;padding:25px;text-align:center;">
            
            <h2 style="color:#4f46e5;margin-bottom:10px;">Nexa AI</h2>
            
            <p style="color:#111;">Hi ${user.name},</p>
            <p style="color:#444;">Click below to verify your email.</p>

            <a href="${BASE_URL}/verify-email?token=${emailVerificationToken}"
               style="display:inline-block;margin:20px 0;padding:12px 20px;
               background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
               Verify Email
            </a>

            <p style="font-size:12px;color:#777;">
                Or open this link:<br/>
                ${BASE_URL}/verify-email?token=${emailVerificationToken}
            </p>

        </div>
    </div>
    `,
            text: "Verify your email",
        });

        // const { password, ...safeUser } = user.toObject();
        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Verify email
 */
export const verifyEmail = async (req, res, next) => {
    try {
        const token = req.query.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: "User not found",
            });
        }

        const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

        user.isVerified = true;
        await user.save();

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verified</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">

  <div style="display:flex;justify-content:center;align-items:center;height:100vh;">
    
    <div style="background:#111827;padding:40px;border-radius:12px;text-align:center;max-width:420px;width:90%;
                box-shadow:0 0 40px rgba(0,0,0,0.6);">

      <h1 style="color:#38bdf8;margin-bottom:10px;">Nexa AI</h1>

      <h2 style="color:#f43f5e;margin:10px 0;">Email Verified ✔</h2>

      <p style="color:#9ca3af;font-size:14px;">
        Your email has been successfully verified.
      </p>

      <p style="color:#9ca3af;font-size:14px;">
        You can now access your account.
      </p>

      <a href="${BASE_URL}"
         style="display:inline-block;margin-top:25px;padding:12px 22px;
         background:linear-gradient(90deg,#f43f5e,#38bdf8);
         color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
         Go to App
      </a>

    </div>

  </div>

</body>
</html>
`;

        res.send(html);
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        const user = await userModel
            .findOne({
                $or: [{ email: identifier }, { username: identifier }],
            })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: "User not found",
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email not verified",
                error: "Email not verified",
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("token", token, cookieOptions);

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res) => {
    const token = req.cookies.token;

    res.clearCookie("token", cookieOptions);

    if (token) {
        await redis.set(token, Date.now().toString());
    }

    res.status(200).json({
        message: "User Logged out successfully",
    });
};

export const getMe = async (req, res) => {
    const user = await userModel.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found",
        });
    }

    res.status(200).json({
        message: "User Fetched Successfully",
        user,
    });
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: "User not found",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        const BASE_URL = process.env.CLIENT_URL || "http://localhost:5173";

        const html = `
                    <div style="font-family:Arial;padding:20px;">
                        <h2>Nexa AI</h2>
                        <p>Click below to reset your password</p>
                        <a href="${BASE_URL}/reset-password?token=${token}"
                            style="padding:10px 15px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
                            Reset Password
                        </a>
                    </div>
                            `;
        await sendEmail({
            to: email,
            subject: "Reset Password",
            text: "Reset Password",
            html,
        });

        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
                error: "Token not found",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password not found",
                error: "Password not found",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decode._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: "User not found",
            });
        }

        user.password = password;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        next(err);
    }
};
