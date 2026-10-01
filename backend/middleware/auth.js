
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

// ======================================================
// Check if user is authenticated
// ======================================================
exports.isAuthenticatedUser = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource",
          401
        )
      );
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(
        new ErrorHandler("User not found", 404)
      );
    }

    next();
  }
);

// ======================================================
// Check if seller is authenticated
// ======================================================
exports.isSeller = catchAsyncErrors(
  async (req, res, next) => {
    const { seller_token } = req.cookies;

    if (!seller_token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource",
          401
        )
      );
    }

    const decodedData = jwt.verify(
      seller_token,
      process.env.JWT_SECRET_KEY
    );

    req.seller = await Shop.findById(decodedData.id);

    if (!req.seller) {
      return next(
        new ErrorHandler("Seller not found", 404)
      );
    }

    next();
  }
);

// ======================================================
// Check if user is authenticated
// ======================================================
exports.isAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource",
          401
        )
      );
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(
        new ErrorHandler("User not found", 404)
      );
    }

    next();
  }
);

// ======================================================
// Check user role
// ======================================================
exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ErrorHandler("User not authenticated", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} can not access this resources!`,
          403
        )
      );
    }

    next();
  };
};
