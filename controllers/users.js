const User = require("../models/user.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const Booking = require("../models/booking");
const Listing = require("../models/listing");





module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "user was succesfully registered!");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
        
    }
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};


module.exports.logIn = async(req, res)=>{
    req.flash("success", "Welcome you are logged in!");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
};


module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};




module.exports.renderProfilePage = async (req, res) => {
    const user = await User.findById(req.user._id);
    

    // Get bookings made by this user and populate the listing
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing");
    res.render("users/profile.ejs", { user, bookings });
};

module.exports.updateProfile = [
    upload.single("profileImage"),
    async (req, res) => {
        const { name, bio } = req.body;
        
        console.log("Uploaded File:", req.file); // Debugging line
        const profileImage = req.file ? req.file.path : req.user.profileImage;
        
        await User.findByIdAndUpdate(req.user._id, {
            name,
            bio,
            profileImage
        });
        
        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    }
];


// Render the Edit Profile Page
module.exports.renderEditProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/profile");
    }
    
    res.render("users/editinfo.ejs", { user });
};

module.exports.renderAllBooking = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.render("users/mybookings", { bookings });
}