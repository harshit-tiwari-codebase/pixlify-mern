/* 
 server create krna 
 server ko configure krna 
 */
const express = require("express");

/*
server ka instance create krna
*/
const app = express();

/*
 this middle ware is used to read the json data
 */
app.use(express.json());


/*
this is for connecting with db function call 
 */
const connectToDb = require("./config/database");
connectToDb();


/**
 * integrating auth router here 
 * and auth api prefix middleware
 */

const authRouter = require("./routes/auth.routes");
app.use("/api/auth" ,authRouter );


/**
 * integrating the post router here 
 * and post api prefix middleware 
 */

const postRouter = require("./routes/post.routes");
app.use("/api/posts" , postRouter);


/**
 * middleware to store the token in cookie storage
 */
const cookie = require("cookie-parser");

module.exports = app;
