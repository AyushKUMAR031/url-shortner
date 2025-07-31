const User = require("../models/userScheme");
// const  {v4: uuidv4} = require('uuid');
/*
    uuid - universally unique identifier.
    128 bits long, 32 characters long - to unqiuely identify a data/object.
*/
const {setUser} = require('../service/auth');

async function handleSignup(req,res){
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });

    const token = setUser(user);
    res.cookie('uid', token, { httpOnly: true });  //res.cookie(name, value, options)
    return res.redirect('/');
}

async function handleUserLogin(req,res){
    const {email, password} = req.body;
    const user = await User.findOne({
        email,
        password,
    });
    
    if(!user) 
        return res.render("login",{
            error: "Invalid email or password"
        });

    /* 
    if all good, then create a session or token
        const sessionId = uuidv4();
        setUser(sessionId, user);
    store the sessionId in the cookie
        res.cookie('uid', sessionId);
    redirect to home page
        return res.redirect('/');
    */

    //in jwt
    const token = setUser(user);
    res.cookie('uid', token, { httpOnly: true }); // this cookie is only to store token (and all thing is client side), so this also stateless.
    return res.redirect('/');
    //return res.json({token}); // for testing purposes, we return the token as JSON
}

async function handleLogout(req, res) {
    res.clearCookie('uid');
    return res.redirect('/landing');
}

module.exports = {
    handleSignup,
    handleUserLogin,
    handleLogout,
};