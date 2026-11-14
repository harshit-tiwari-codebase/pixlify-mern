require("dotenv").config();
const app = require("../Backend/src/app");

/**
 *  the app is running on the port 3000
  */ 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`the app is running on port ${PORT}`);
});
