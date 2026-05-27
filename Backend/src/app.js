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





module.exports = app;
