const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

// Only run initDB if this file is run directly
if (require.main === module) {
    initDB().then(() => {
        console.log("Database initialization completed");
        process.exit(0);
    }).catch(err => {
        console.error("Database initialization failed:", err);
        process.exit(1);
    });
}