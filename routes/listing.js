const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const isLoggedIn = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Add List (Create Route)
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    // let listing = req.body.listing;
    // const newListing = new Listing(req.body.listing);
    // One method
    // if (!newListing.title) {
    //   throw new ExpressError(400, "Title is required");
    // }
    // if (!newListing.description) {
    //   throw new ExpressError(400, "Description is required");
    // }
    // if (!newListing.price) {
    //   throw new ExpressError(400, "Price is required");
    // }
    // if (!newListing.location) {
    //   throw new ExpressError(400, "Location is required");
    // }
    // if (!newListing.country) {
    //   throw new ExpressError(400, "Country is required");
    // }

    // Another method
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//get form to Edit List
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update List in /listings
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
