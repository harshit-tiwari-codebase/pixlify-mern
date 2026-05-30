const express = require("express");
const app = express();
app.use(express.json());

// Register cookie-parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());



const connectToDb = require("./config/database");
connectToDb();

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const postRouter = require("./routes/post.routes");
app.use("/api/posts", postRouter);

module.exports = app;