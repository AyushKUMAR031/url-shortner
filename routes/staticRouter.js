const express = require('express');
const URL = require('../models/urlScheme');

const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.user) return res.redirect('/landing'); // guest (not logged in)

    const allurls = await URL.find({ createdBy: req.user._id }); // Fetch URLs created by the logged-in user
    // Render the home page
    return res.render('home',{
        urls: allurls,
    });
});

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.get('/login',(req,res)=>{
    return res.render('login');
})

router.get('/landing', (req, res) => {
    return res.render('landing'); // basic welcome page with "Login" and "Signup" links
});

module.exports = router;