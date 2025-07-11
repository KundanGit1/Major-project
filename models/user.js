const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    profileImage: {
        type: String,
        // url: String,
        // filename: String,
        default:"default.jpg" // Placeholder image
    }
});

//this plugin automatically add username, hash,hashed password, and salt value.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);