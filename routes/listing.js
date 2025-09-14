const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details.map((err) => err.message), 400);
    }
    next();
};



//Index Route

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

//New Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new");
});

//show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("show", { listing });
});

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send some valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    console.log(deleteListing);
    res.redirect("/listings");
  })
);


module.exports = router;