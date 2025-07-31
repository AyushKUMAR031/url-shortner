const { getUser } = require('../service/auth');

// Middleware to check for authentication (combined of checkForAuthentication and restrictToLoggedInUserOnly)
// function checkForAuthentication(req,res,next){
//     const userUid = req.cookies?.uid;

//     req.user = null;

//     if(! userUid || !userUid.startsWith('Bearer')){
//         return next();
//     }

//     const token = userUid.split('Bearer ')[1];
//     const user = getUser(token);
    
//     req.user = user;
//     return next();
// }

// Middleware to restrict access (Authorization)
function restrictTo(roles){
    return function (req, res, next) {
        if(!req.user) return res.redirect('/login');

        if(roles.includes(req.user.role)) return res.end('Unauthorized');

        next();
    };
}
async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.redirect('/login');
    }
    const user = getUser(userUid);

    if (!user) {
        return res.redirect('/login');
    }
    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    
    const user = getUser(userUid);
    
    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
    // restrictTo,
    // checkForAuthentication,
};
