//server side schema validation with the help of joi npm package
const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.object({

        //     url: Joi.string().uri().allow("", null) // Only validate URL here
        // }).required()
        // image: Joi.string().allow("", null),

        image: Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        }).required()
    }).required() 
});


//review Schema server side validation

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
}) ;
