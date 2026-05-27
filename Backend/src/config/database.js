const mongoose = require("mongoose");

function connectToDb () {
    mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("we are connected to the DB succesfully");
    })
}

module.exports = connectToDb;