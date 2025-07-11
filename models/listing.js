//required mongoose
const mongoose = require("mongoose");
const Review = require("./review");
const { ref } = require("joi");

const Schema = mongoose.Schema;

//Store an object with filename and url.
// const imageSchema = new Schema({
//     image: {
//         filename: String ,
//         url: String ,
//       }
// });

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
       
        url: String,
        filename: String,
        
        
        // filename: {
        //     type: String,
        //     required: false,
        //   },
        //   url: {
        //     type: String,
        //     default: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
        //     set: (v) => v === "" ? 
        //       "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"
        //       : v,
            
        //   }
    },
    //update image
    // image: imageSchema,
    price:{
        type: Number,
        required: true, // Make price mandatory
        default: 0,     // Default to 0 if not provided
    },
    location: String,
    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//deleting Middleware for Review, when listing is deleted,it will helps to insuring review has also deleted.
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});



const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;