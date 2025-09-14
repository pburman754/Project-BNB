const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const{validateReview}=require("../middleware.js");


//Reviews
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "Review added successfully");
        res.redirect(`/listings/${id}`);
    })
);

//review delte route
router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully");
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;
