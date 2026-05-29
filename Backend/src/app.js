const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

// Register cookie-parser middleware
app.use(cookieParser());

const connectToDb = require("./config/database");
connectToDb();

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const postRouter = require("./routes/post.routes");
app.use("/api/posts", postRouter);

module.exports = app;