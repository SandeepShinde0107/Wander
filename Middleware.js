// const listing=require("./models/listing");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema}= require("./schema.js");
// const review = require("./models/review.js");

// module.exports.isLoggedIn=(req,res,next)=>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl= req.originalUrl;
//         req.flash("error", "you must be logged in to create listing");
//         return res.redirect("/login");
//     }
//     next();
// };

// // here the redirecturl is saved so that it can be made accessible on the platform
// module.exports.saveRedirectUrl=(req, res, next)=>{
//     if(!req.session.redirectUrl){
//         res.locals.redirectUrl=req.session.redirectUrl;
//     }
//     next();
// };

// // authorization for listings
// module.exports.isOwner= async(req, res ,next)=>{
//     let{id}=req.params;
//  let listing= await listing.findById(id);
//  if( !currUser && listing.owner._id.equals(res.equals.currUser._id)){
//     req.flash("error", "you are not the owner of this listing");
//    return  res.redirect(`/listings/${id}`);
//  }
//  next();
// };

// module.exports.validateListing=(req,res,next)=>{
//         let {error}= listingSchema.validate(req.body);
//         if(error){
//             let errMsg = error.details.map((el)=>el.message).join(",");
//          throw new ExpressError(400, errMsg);
//         }else{
//             next();
//         }
//     };
    
// module.exports.validateReview=(req,res,next)=>{
//     let {error}= reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

// // authorization part2
// module.exports.isReviewAuthor= async(req, res ,next)=>{
//     let{id ,reviewid}=req.params;
//  let review= await Review.findById(reviewId);
//  if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("error", "you did not create this review");
//    return  res.redirect(`/listings/${id}`);
//  }
//  next();
// };


const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl || "";
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
