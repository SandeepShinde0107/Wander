const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Failed to fetch listings");
        res.redirect("/"); // Handle error as needed
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { list: listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        req.flash("error", "Failed to fetch listing");
        res.redirect("/listings"); // Handle error as needed
    }
};

module.exports.createListing = async (req, res) => {
    try {
        let { url, filename } = req.file;
        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image: { url, filename }
        });
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Failed to create new listing");
        res.redirect("/listings/new"); // Handle error as needed
    }
};

module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        req.flash("error", "Failed to fetch listing for edit");
        res.redirect("/listings"); // Handle error as needed
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (req.file) {
            let { url, filename } = req.file;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("error", "Failed to update listing");
        res.redirect("/listings"); // Handle error as needed
    }
};

module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing deleted");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Failed to delete listing");
        res.redirect("/listings"); // Handle error as needed
    }
};
