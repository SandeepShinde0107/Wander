const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review= require("../models/review.js")
const Listing=require("../models/listing.js");
// const session= require("express-session");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../Middleware.js");
const { createReview } = require("../controllers/reviews.js");

const reviewController=require("../controllers/reviews.js");

router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));


// delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;

