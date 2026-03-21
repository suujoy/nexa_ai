import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
};

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Min 3 characters")
        .trim(),
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Min 3 characters")
        .trim()
        .toLowerCase(),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Min 6 characters"),
    validate,
];

export const loginValidator = [
    body("identifier")
        .notEmpty()
        .withMessage("Email or username is required")
        .trim(),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
];
