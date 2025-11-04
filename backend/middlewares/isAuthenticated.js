const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            const decoded = await jwt.verify(token, process.env.SECRET_KEY);
            if (!decoded) {
                console.log('invalid token...');
                return res.json({msg :"Invalid token..."})
            }
            req.userId = decoded.userId;
            req.userName = decoded.userName;
            req.userRole = decoded.userRole;

            next();
            
        } else {
            console.log("User not authenticated...");
            res.json({msg: "User not authenticated..."});
        }
    } catch (error) {
        console.log('not able to login into the database');
        res.json({ msg: "not able to connect to the data base", error });
    }
}

module.exports = { isAuthenticated };