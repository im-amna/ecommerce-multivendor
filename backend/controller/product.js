const express = require("express");
const router = express.Router();

const {
  isSeller,
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../model/product");
const Order = require("../model/order");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// ======================================================
// CREATE PRODUCT
// ======================================================
router.post(
  "/create-product",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // ----------------------------------------------
      // Get logged-in seller
      // ----------------------------------------------
      const shop = req.seller;

      if (!shop) {
        return next(
          new ErrorHandler("Shop is invalid!", 400)
        );
      }

      // ----------------------------------------------
      // Get images from frontend
      // ----------------------------------------------
      let images = req.body.images;

      if (!images) {
        return next(
          new ErrorHandler(
            "Please upload at least one image!",
            400
          )
        );
      }

      // If only one image is received as a string
      if (typeof images === "string") {
        images = [images];
      }

      if (!Array.isArray(images) || images.length === 0) {
        return next(
          new ErrorHandler(
            "Please upload at least one image!",
            400
          )
        );
      }

      // ----------------------------------------------
      // Upload images to Cloudinary
      // ----------------------------------------------
      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result =
          await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // ----------------------------------------------
      // Prepare product data
      // ----------------------------------------------
      const productData = {
        ...req.body,

        // Remove frontend images because we are
        // replacing them with Cloudinary data
        images: imagesLinks,

        // IMPORTANT:
        // Product model requires shopId
        shopId: shop._id.toString(),

        // Product model also requires shop
        shop: shop,
      };

      // ----------------------------------------------
      // Create product
      // ----------------------------------------------
      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Product creation failed",
          400
        )
      );
    }
  })
);

// ======================================================
// GET ALL PRODUCTS OF A SHOP
// ======================================================
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({
        shopId: req.params.id,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error(
        "GET SHOP PRODUCTS ERROR:",
        error
      );

      return next(
        new ErrorHandler(
          error.message ||
            "Unable to get shop products",
          400
        )
      );
    }
  })
);


// DELETE SHOP PRODUCT
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(
          new ErrorHandler(
            "Product is not found with this id",
            404
          )
        );
      }

      // Make sure seller owns this product
      if (
        product.shopId &&
        product.shopId.toString() !==
          req.seller._id.toString()
      ) {
        return next(
          new ErrorHandler(
            "You are not authorized to delete this product",
            403
          )
        );
      }

      const productImages = product.images || [];

      // Delete product from MongoDB FIRST
      await Product.findByIdAndDelete(req.params.id);

      // Then delete images from Cloudinary
      for (const image of productImages) {
        if (image.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(
              image.public_id
            );
          } catch (cloudinaryError) {
            console.error(
              "CLOUDINARY DELETE ERROR:",
              cloudinaryError.message
            );
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      return next(
        new ErrorHandler(
          error.message ||
            "Unable to delete product",
          400
        )
      );
    }
  })
);

// ======================================================
// GET ALL PRODUCTS
// ======================================================
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error(
        "GET ALL PRODUCTS ERROR:",
        error
      );

      return next(
        new ErrorHandler(
          error.message ||
            "Unable to get products",
          400
        )
      );
    }
  })
);

// ======================================================
// CREATE NEW REVIEW
// ======================================================
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        user,
        rating,
        comment,
        productId,
        orderId,
      } = req.body;

      // ----------------------------------------------
      // Find product
      // ----------------------------------------------
      const product = await Product.findById(
        productId
      );

      if (!product) {
        return next(
          new ErrorHandler(
            "Product not found",
            404
          )
        );
      }

      // ----------------------------------------------
      // Create review object
      // ----------------------------------------------
      const review = {
        user,
        rating,
        comment,
        productId,
      };

      // ----------------------------------------------
      // Check if user already reviewed
      // ----------------------------------------------
      const isReviewed = product.reviews.find(
        (rev) =>
          rev.user &&
          rev.user._id &&
          rev.user._id.toString() ===
            req.user._id.toString()
      );

      // ----------------------------------------------
      // Update existing review
      // ----------------------------------------------
      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (
            rev.user &&
            rev.user._id &&
            rev.user._id.toString() ===
              req.user._id.toString()
          ) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        // --------------------------------------------
        // Add new review
        // --------------------------------------------
        product.reviews.push(review);
      }

      // ----------------------------------------------
      // Calculate average rating
      // ----------------------------------------------
      let totalRating = 0;

      product.reviews.forEach((rev) => {
        totalRating += rev.rating;
      });

      product.ratings =
        totalRating / product.reviews.length;

      // ----------------------------------------------
      // Save product
      // ----------------------------------------------
      await product.save({
        validateBeforeSave: false,
      });

      // ----------------------------------------------
      // Mark product as reviewed in order
      // ----------------------------------------------
      if (orderId) {
        await Order.findByIdAndUpdate(
          orderId,
          {
            $set: {
              "cart.$[elem].isReviewed": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem._id": productId,
              },
            ],
            new: true,
          }
        );
      }

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      console.error(
        "CREATE REVIEW ERROR:",
        error
      );

      return next(
        new ErrorHandler(
          error.message ||
            "Unable to create review",
          400
        )
      );
    }
  })
);

// ======================================================
// ALL PRODUCTS FOR ADMIN
// ======================================================
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error(
        "ADMIN PRODUCTS ERROR:",
        error
      );

      return next(
        new ErrorHandler(
          error.message ||
            "Unable to get products",
          500
        )
      );
    }
  })
);

module.exports = router;