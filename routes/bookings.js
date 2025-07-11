const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Show booking form
router.get("/new/:listingId", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("bookings/new", { listing });
}));

// Handle booking submission
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const { listingId, startDate, endDate, guests } = req.body;
    const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        startDate,
        endDate,
        guests
    });
    await booking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect(`/listings/${listingId}`);
}));


// Delete Booking
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/profile");
    }

    // Optional: restrict delete to booking owner only
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You do not have permission to cancel this booking.");
        return res.redirect("/profile");
    }

    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking canceled.");
    res.redirect("/profile");
}));




module.exports = router;
