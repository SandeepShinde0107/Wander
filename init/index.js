const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await listing.deleteMany({});
    // listing owner
   initData.data= initData.data.map((obj)=>({...obj, owner:'664d5b1b896df0a9b0975ada'}));
    await listing.insertMany(initData.data);
    console.log("data was initialized");

};
initDB();