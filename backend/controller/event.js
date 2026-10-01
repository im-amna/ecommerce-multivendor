const express = require("express");
const router = express.Router();

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");

const {
  isSeller,
  isAdmin,
  isAuthenticated,
} = require("../middleware/auth");

const cloudinary = require("cloudinary");

// ======================================================
// CREATE EVENT
// ======================================================
router.post(
  "/create-event",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = req.seller;

      if (!shop) {
        return next(
          new ErrorHandler("Shop is invalid!", 400)
        );
      }

      let images = req.body.images;

      if (!images) {
        return next(
          new ErrorHandler(
            "Please upload at least one image!",
            400
          )
        );
      }

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

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(
          images[i],
          {
            folder: "events",
          }
        );

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const eventData = {
        ...req.body,
        shopId: shop._id.toString(),
        shop: shop,
        images: imagesLinks,
      };

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Event creation failed",
          400
        )
      );
    }
  })
);

// ======================================================
// GET ALL EVENTS
// ======================================================
router.get(
  "/get-all-events",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      console.error("GET ALL EVENTS ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Unable to get events",
          400
        )
      );
    }
  })
);

// ======================================================
// GET ALL EVENTS OF A SHOP
// ======================================================
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({
        shopId: req.params.id,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      console.error("GET SHOP EVENTS ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Unable to get shop events",
          400
        )
      );
    }
  })
);

// ======================================================
// DELETE EVENT
// ======================================================
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(
          new ErrorHandler(
            "Event is not found with this id",
            404
          )
        );
      }

      if (event.images && event.images.length > 0) {
        for (let i = 0; i < event.images.length; i++) {
          if (event.images[i].public_id) {
            await cloudinary.v2.uploader.destroy(
              event.images[i].public_id
            );
          }
        }
      }

      await Event.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Event deleted successfully!",
      });
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Unable to delete event",
          400
        )
      );
    }
  })
);

// ======================================================
// ALL EVENTS FOR ADMIN
// ======================================================
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      console.error("ADMIN EVENTS ERROR:", error);

      return next(
        new ErrorHandler(
          error.message || "Unable to get events",
          500
        )
      );
    }
  })
);

module.exports = router;