const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pixlify-mern-1.onrender.com"],
    credentials: true,
  })
);

// Register cookie-parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' http://localhost:3000 http://localhost:5173 https://pixlify-mern-1.onrender.com",
    ].join("; ")
  );
  next();
});



const connectToDb = require("./config/database");
connectToDb();


/**
 * requiring routes
 */
const authRouter = require("./routes/auth.routes");
const followRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");

/**
 * using routes
 */
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/user", followRouter);
app.use("/api/comment",commentRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


module.exports = app;
