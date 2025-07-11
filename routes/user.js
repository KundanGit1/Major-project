const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn} = require("../middleware.js");

const userController = require("../controllers/users.js");





router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);



router.post("/login",
    saveRedirectUrl,
    passport
    .authenticate("local", 
    {failureRedirect: "/login",
        failureFlash: true
    }),
    userController.logIn,
);


// Profile route (GET)
router.get("/profile",
     isLoggedIn, 
     userController.renderProfilePage
    );

// Profile update route (POST)
router.post("/profile",
     isLoggedIn,
     userController.updateProfile
    );

// Route to render the edit profile page
router.get("/users/:id/edit",
     isLoggedIn,
      wrapAsync(userController.renderEditProfile)
    );

// Show all bookings for the logged-in user
router.get("/mybookings", 
    isLoggedIn, 
    wrapAsync(userController.renderAllBooking)
);



router.get("/logout", userController.logOut);

module.exports = router;