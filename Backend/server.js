require("dotenv").config();
const app = require("../Backend/src/app");

/**
 *  the app is running on the port 3000
  */ 
app.listen(3000, () => {
  console.log("the app is running on port 3000");
});
