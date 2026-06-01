const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Register cookie-parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());



const connectToDb = require("./config/database");
connectToDb();


/**
 * requiring routes
 */
const authRouter = require("./routes/auth.routes");
const followRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");

/**
 * using routes
 */
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/user", followRouter);


module.exports = app;