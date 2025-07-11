const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { equal } = require("joi");

const listingController = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// index Route1
router.get("/", 
    wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Show listings created by the logged-in user
router.get("/mylistings", isLoggedIn, wrapAsync(async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id });
    res.render("listings/mylistings", { listings });
}));

// Search route
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.redirect("/listings");
  }
  const regex = new RegExp(query, "i"); // case-insensitive match
  const allListings = await Listing.find({
    $or: [
      { title: regex },
      { location: regex }
    ]
  });

  res.render("listings/index", { allListings });
});





 // create Route
router.post("/",
    isLoggedIn,
    
    upload.single('listing[image]'),
    
     wrapAsync(listingController.CreateListing),
     validateListing,
); 



//Edit  route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderEditForm)
);


//update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    
    wrapAsync(listingController.updateListing),
    validateListing,
);
    


//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.deleteListing)
);


//READ(show Route)
router.get("/:id",
     wrapAsync(listingController.showListing)
);



module.exports = router;