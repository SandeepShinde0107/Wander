// const express= require("express");
// const router = express.Router();
// const wrapAsync=require("../utils/wrapAsync.js");
// const listing=require("../models/listing.js");
// // const reviews = require("./routes/review.js")
// const Review= require("./review.js")
// // const listings=require("./routes/listing.js");
// const {isLoggedIn, isOwner,validateListing}=require("../Middleware.js");

// const listingController= require("../controllers/listings.js");
// const multer=require('multer')
// const storage=require("../cloudConfig.js");
// const upload=multer({storage});


// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));
// // validation schema through middleware


// // router.Route
// router.route("/")
// .get("/",  wrapAsync(listingController.index))
// .post("/",isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


// // new route
// router.get("/new",isLoggedIn,listingController.renderNewForm);

// // router.route for /id
// router.route("/:id")
// .get(wrapAsync(listingController.showListing))
// .put(isLoggedIn,isOwner,upload.single('listing[image]'),  validateListing, wrapAsync(listingController.updateListing))
// .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// // edit route
// router.get("/:id/edit",isLoggedIn,isOwner,  wrapAsync(listingController.renderEditForm));


// module.exports=router;

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../Middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const storage = require('../cloudConfig.js');
const upload = multer({ storage });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
