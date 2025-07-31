// using shortid package for generating unique IDs
const shortid = require('shortid');
const URL = require('../models/urlScheme');

async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    
    if(!body.url){
        return res.status(400).json({
            error: 'URL is required'}
        );
    }
    
    const shortId = shortid(); // Generate a unique short ID of length 8
    
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id, // Attach the user ID of the logged-in user
    });

    // return res.json({
    //     shortId: shortId,
    // }); this is returning the shortid in json, but we want a ui view

    return res.render('home',{
        id: shortId,
    })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });
    return res.json({
        totalClicks: entry.visitHistory.length,
        analytics: entry.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}