//const sessionIdToUserMap = new Map(); 
// This map will hold the session ID as key and user object as value
// but this is not persistent, so if the server restarts, all sessions will be lost.
// In a real application, you would use a database or a cache like Redis to store sessions.

//so now we will use JWT
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const secret = process.env.JWT_SECRET;

function setUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
    };
    return jwt.sign(payload, secret, {
        expiresIn: '1h', // Token will expire in 1 hour
    });
    //sessionIdToUserMap.set(id, user);
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    }catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};