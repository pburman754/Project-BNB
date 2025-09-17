// Import required modules and middleware
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const ExpressError = require("../utils/ExpressError.js"); // Custom error class
const Listing = require("../models/listing.js"); // Listing model
const { listingSchema } = require("../schema.js"); // Joi validation schema
const {
  isLoggedIn,      // Middleware to check if user is logged in
  isOwner,         // Middleware to check if user owns the listing
  validateListing, // Middleware to validate listing data
  isReviewAuthor,  // Middleware to check if user authored the review
} = require("../middleware.js");
const ListingController = require("../controllers/listing.js"); // Controller for listing routes

// Route for listing all listings and creating a new listing
router
  .route("/")
  .get(wrapAsync(ListingController.index)) // Get all listings
  // .post(
  //   isLoggedIn,                // Ensure user is logged in
  //   validateListing,           // Validate listing data
  //   wrapAsync(ListingController.createListing) // Create new listing
  // );

// Route to render form for creating a new listing
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Route for showing, updating, and deleting a specific listing
router
  .route("/:id/")
  .get(wrapAsync(ListingController.showListing)) // Show listing details
  .put(
    isLoggedIn,                // Ensure user is logged in
    isOwner,                   // Ensure user owns the listing
    validateListing,           // Validate listing data
    wrapAsync(ListingController.updateListing) // Update listing
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing)); // Delete listing

// Route to render form for editing an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,                // Ensure user is logged in
  isOwner,                   // Ensure user owns the listing
  wrapAsync(ListingController.renderEditForm) // Render edit form
);

module.exports = router; // Export the router
