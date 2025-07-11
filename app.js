if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}



//required express
const express = require("express");
const app = express();
//requiring path
const path = require("path"); 
//required mongoose
const mongoose = require("mongoose");
// required method-override
const methodOverride = require("method-override");
// requiring EJS-mate
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
//requiring router module, listing.js
const listingRouter = require("./routes/listing.js");
//requiring router module, review.js
const reviewRouter = require("./routes/review.js");
//requiring router for user authentication
const userRouter = require("./routes/user.js");
// requiring express-session
const session = require("express-session");
const MongoStore = require('connect-mongo');
// requiring connect-flash
const flash = require("connect-flash");
//require user Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// for Bookings
const bookingRoutes = require("./routes/bookings");



const dbUrl = process.env.ATLASDB_URL;

//setup mongoose
main().then((res)=>{
    console.log("Database connected successfully");
}).catch(( err) => {
    console.log("Database connection failed:", err);
});

async function main() {
  await mongoose.connect(dbUrl);
}


//connecting views folder.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//for parsing
app.use(express.urlencoded({extended:true}));
// method-override
app.use(methodOverride("_method"));
//ejs-mate
app.engine("ejs", ejsMate);
//use static folder % file
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
        
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

//using express session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



// app.get("/", (req, res)=>{
//     res.send("Hi, I am root"); 
// });



app.use(session(sessionOptions));
app.use(flash());

// user authentication
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// // demo user login 
// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "college_student",
//     });

//     let registeredUser = await User.register(fakeUser,"lectures");
//     res.send(registeredUser);
// });




// using listing.js routes
app.use("/listings", listingRouter);
//using review.js router
app.use("/listings/:id/reviews", reviewRouter);
//using user authentication
app.use("/", userRouter);
// for booking
app.use("/bookings", bookingRoutes);




// for all route error message send
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "page not found!"));
});

//Custom error Handling middleware
app.use((err, req, res, next)=>{
    let  {statusCode=500, message="Something went wrong!"} = err ;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});




//connect with port
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});







