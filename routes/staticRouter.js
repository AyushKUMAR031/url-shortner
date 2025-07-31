const express = require('express');
const URL = require('../models/urlScheme');

const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.user) return res.redirect('/landing'); 

    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render('home',{
        urls: allurls,
        user: req.user,
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