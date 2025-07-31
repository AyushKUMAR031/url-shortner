const {getUser} = require('../service/auth');

async function restrictToLoggedInUserOnly(req,res,next){

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.redirect("/login");

    const token = authHeader.split("Bearer ")[1];


    const user = getUser(token); //decode and verify token
    if(!user) return res.redirect("/login");

    req.user = user; // attach user to request object and aage bhejna for the next middleware or route handler
    next(); 
}

async function checkAuth(req, res, next) {
    //*const userUid = req.cookies?.uid; //request ke body ke cookie mei se uid laao, kyuki har req par cookie send hota hai.

    const authHeader = req.headers['authorization']; 
    if (!authHeader) {
        return next(); // if no token, proceed as if user not logged in
    }

    const token = authHeader.split("Bearer ")[1]; // assuming the format is "Bearer <token>"
    const user = getUser(token); // getUser function will decode the token and return the user object

    //*const user = getUser(userUid);
    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
}