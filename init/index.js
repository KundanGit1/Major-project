//required mongoose
const mongoose = require("mongoose");
//require models/Listing
const Listing = require("../models/listing");
//requiring data.js
const initData = require("./data");



//setup mongoose
main().then((res)=>{
    console.log(res);
}).catch(( err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//initialisation of data
const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "682334643e58a1686809023e"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();