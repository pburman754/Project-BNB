const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  isReviewAuthor,
} = require("../middleware.js");

//controllers
const ListingController = require("../controllers/listing.js");

//Index Route

router.get("/", wrapAsync(ListingController.index));

//New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

//show Route
router.get("/:id", wrapAsync(ListingController.showListing));

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(ListingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(ListingController.updateListing)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.deleteListing)
);

module.exports = router;
