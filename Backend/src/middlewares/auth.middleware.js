const jwt = require("jsonwebtoken")

async function identifyUser (req,res,next){
 
        /**
         * Get authentication token from cookies
         */
        const token = req.cookies["login-cookie"];
    
        /**
         * Check if token exists
         */
        if (!token) {
          return res.status(401).json({
            message: "Authentication token is required",
          });
        }
    
        /**
         * Verify JWT token
         */
        let decoded;
    
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
          return res.status(401).json({
            message: "Invalid or expired token",
          });
    }

    req.user = decoded;
    next();
}

module.exports = identifyUser;