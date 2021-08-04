const expressJwt = require('express-jwt');
require('dotenv').config();
module.exports = jwt;

function jwt() {
    const secret = process.env.JWT_SECRET;
    return expressJwt({ secret, algorithms: ['HS256']}).unless({
        path: [
            // Auth routes that don't require authentication
            '/api/auth/authenticate',
            '/api/auth/register',
            '/api/auth/google-authenticate',
            '/api/auth/google-login'
        ]
    });
}
