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
        //Creating A Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return {
            ...user.getUserData(),
            token
        };
    }
}

async function register(userParam) {
    //Check if username can be taken
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    //Checks if email id is already in use
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email id "' + userParam.email + '" is already in use';
    }
    const user = new User(userParam);

    // hashing the password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    // saving the user
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
    return {
        ...user.getUserData(),
        token
    }
}

async function registerGoogleAccount(code) {

    var googleData = await googleAPI.getUserAccount(code);
    var googleEmail = googleData.user.email;
    const user = await User.findOne({ "email": googleEmail });

    //Checking if user exists and authenticate
    if (user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return {
            ...user.getUserData(),
            token
        };
    }
    else {
        var passwordtemp = bcrypt.hashSync(googleData.tokens.access_token, 10);
        var usernametemp = googleData.user.email.split("@")[0];
        var userParam = {
            email: googleData.user.email,
            name: googleData.user.given_name + ' ' + googleData.user.family_name,
            username: usernametemp,
            password: passwordtemp
        }
        const NewUser = new User(userParam);
        await NewUser.save();

        const user = await User.findOne({ "email": googleEmail });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '86400s' });
        return {
            ...user.getUserData(),
            token
        };
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
