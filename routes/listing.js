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
const ListingController = require("../controllers/listing.js"); 
const { upload } = require("../cloudConfig.js");


router
  .route("/")
  .get(wrapAsync(ListingController.index)) 
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.createListing)
  );


router.get("/new", isLoggedIn, ListingController.renderNewForm);


router
  .route("/:id/")
  .get(wrapAsync(ListingController.showListing)) 
  .put(
    isLoggedIn, 
    isOwner, 
    upload.single("listing[image]"), // <-- fixed field name
    validateListing, 
    wrapAsync(ListingController.updateListing) 
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing)); 


router.get(
  "/:id/edit",
  isLoggedIn, 
  isOwner, 
  wrapAsync(ListingController.renderEditForm) 
);

module.exports = router;
