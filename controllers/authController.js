const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const googleAPI = require('../util/google-api');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

async function authenticate({ email, password }) {
    // finding the use detail
    const user = await User.findOne({ email });
    // validating password and checking if user exists
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return { "token": token }
    } else {
        return { "status": 403, "message": "Wrong email or password." }
    }
}

async function register({ email, password }) {
    //Checks if email id is already in use
    if (await User.findOne({ "email": email })) {
        return{ "message": "Email id " + email + " is already in use." }
    }
    else {
        const user = new User({ email, password });
        // hashing the password
        if (password) { user.password = bcrypt.hashSync(password, 10) }
        // saving the user
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return { "status": 200, "token": token }
    }
}

async function registerGoogleAccount({ code }) {
    
    var googleData = await googleAPI.getUserAccount(code);
    var googleEmail = googleData.user.email;
    const user = await User.findOne({ "email": googleEmail });

    if (user) {
        // Sending user token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return { token };
    }
    else {
        // Saving new user
        const user = new User({
            email: googleData.user.email,
            password: bcrypt.hashSync(googleData.tokens.access_token, 10)
        });
        await user.save();
        // Sending user token
        const user = await User.findOne({ "email": googleEmail });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return { token };
    }
}

function userVerification(req, res, next) {
    var authorization = req.headers.authorization.split(' ')[1],decoded;
    decoded = jwt.verify(authorization, secret);
    req.body.id = decoded.id;
    if(decoded.id){
        next();
    }else{
        res.send("Verification Failed.");
    }
}

module.exports ={
    userVerification,
    authenticate,
    register,
    registerGoogleAccount
}
