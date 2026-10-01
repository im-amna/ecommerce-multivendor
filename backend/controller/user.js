
const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticatedUser } = require("../middleware/auth");

// =====================================================
// CREATE USER


router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check required fields
    if (!name || !email || !password || !avatar) {
      return next(
        new ErrorHandler("Please provide all required fields", 400)
      );
    }

    // Check if user already exists
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Upload avatar to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });

    // Temporary user object
    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    // Create activation token
    const activationToken = createActivationToken(user);

    // Activation URL
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // Send activation email
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.log("CREATE USER ERROR:", error);

    return next(new ErrorHandler(error.message, 400));
  }
});

// =====================================================
// CREATE ACTIVATION TOKEN
// =====================================================

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "30m",
  });
};

// =====================================================
// ACTIVATE USER
// =====================================================

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      // Check token
      if (!activation_token) {
        return next(
          new ErrorHandler("Activation token is required", 400)
        );
      }

      // Verify activation token
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(
          new ErrorHandler("Invalid activation token", 400)
        );
      }

      const { name, email, password, avatar } = newUser;

      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return next(
          new ErrorHandler("User already exists", 400)
        );
      }

      // Create user in database
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      // Login user and send token
      sendToken(user, 201, res);
    } catch (error) {
      // Expired JWT token
      if (error.name === "TokenExpiredError") {
        return next(
          new ErrorHandler(
            "Activation token has expired. Please request a new activation email.",
            400
          )
        );
      }

      // Invalid JWT token
      if (error.name === "JsonWebTokenError") {
        return next(
          new ErrorHandler("Invalid activation token.", 400)
        );
      }

      console.log("ACTIVATION ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =====================================================
// LOGIN USER
// =====================================================

router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check fields
      if (!email || !password) {
        return next(
          new ErrorHandler(
            "Please provide all the fields!",
            400
          )
        );
      }

      // Find user
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new ErrorHandler("User doesn't exist!", 400)
        );
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler(
            "Please provide the correct information",
            400
          )
        );
      }

      // Login user
      sendToken(user, 201, res);
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(
          new ErrorHandler("Please provide your email address", 400)
        );
      }

      const user = await User.findOne({ email });

      // Don't reveal whether email exists
      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      }

      // Create reset token
      const resetToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.RESET_PASSWORD_SECRET,
        {
          expiresIn: "15m",
        }
      );

      // Frontend reset URL
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

      await sendMail({
        email: user.email,
        subject: "Reset your password",
        message: `Hello ${user.name},

You requested to reset your password.

Please click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Thank you!`,
      });

      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email.",
      });
    } catch (error) {
      console.log("FORGOT PASSWORD ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.put(
  "/reset-password/:token",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return next(
          new ErrorHandler(
            "Please provide password and confirm password",
            400
          )
        );
      }

      if (password !== confirmPassword) {
        return next(
          new ErrorHandler("Passwords do not match", 400)
        );
      }

      if (password.length < 6) {
        return next(
          new ErrorHandler(
            "Password must be at least 6 characters long",
            400
          )
        );
      }

      // Verify reset token
      let decoded;

      try {
        decoded = jwt.verify(
          token,
          process.env.RESET_PASSWORD_SECRET
        );
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return next(
            new ErrorHandler(
              "Password reset link has expired. Please request a new one.",
              400
            )
          );
        }

        return next(
          new ErrorHandler(
            "Invalid password reset link.",
            400
          )
        );
      }

      const user = await User.findById(decoded.id).select("+password");

      if (!user) {
        return next(
          new ErrorHandler("User does not exist", 404)
        );
      }

      // Update password
      user.password = password;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully. You can now login with your new password.",
      });
    } catch (error) {
      console.log("RESET PASSWORD ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =====================================================
// LOAD USER
// =====================================================

router.get(
  "/getuser",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(
          new ErrorHandler("User doesn't exist", 400)
        );
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("GET USER ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =====================================================
// LOGOUT USER
// =====================================================

router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      console.log("LOGOUT ERROR:", error);

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;