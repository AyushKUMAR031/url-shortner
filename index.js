const express = require('express');
const app = express();
const path = require('path');
const PORT = 8001;

const URL = require('./models/urlScheme');

const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/userRoutes'); 
const urlRoute = require('./routes/urlRoutes');

const { restrictToLoggedInUserOnly, checkAuth } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

//DB
const connectDB = require('./connect');
connectDB(process.env.MONGO_URL)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('MongoDB connection error:',err));



// View Engine
app.set('view engine', 'ejs'); // Set EJS as the view engine for SSR
// app.set('views','./views'); // Set the directory for views (relative path (default))
app.set('views', path.resolve('./views')); // absolute path to the dir. //both are fine



// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies (Forms)
app.use(cookieParser()); // Middleware to parse cookies



//routes
app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home',{
        urls: allUrls
    }); // .render is a function that renders a dynamic view
    // we can pass variables also to the view to render it.
});

app.use('/url',restrictToLoggedInUserOnly, urlRoute); //✅ Only allow logged-in users to shorten URLs 
//restrictToLoggedInUserOnly is a middleware that checks if the user is logged in or not. **(inline middleware)**

app.use('/user', userRoute);  // 🔓 Public for signup/login
app.use('/', checkAuth, staticRoute); //Auth optional (to show user's URLs)

app.get('/url/:shortId',async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
            visitHistory: {
                timestamp: Date.now(),
                date: new Date(),
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            }
        },
    });
    
    if (!entry) {
        return res.status(404).send('Short URL not found');
    }
    res.redirect(entry.redirectURL);
});


// Server listening 
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})