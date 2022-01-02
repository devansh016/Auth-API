const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAPI = require('../util/google-api');

router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/google-authenticate', googleAuthenticate);
router.get('/google-login', getGoogleAuthURL);

function authenticate(req, res, next) {
    authController.authenticate(req.body)
        .then(data => {
            res.send(data) 
        })
        .catch(err => next(err));
}

function register(req, res, next) {
    authController.register(req.body)
        .then(data => {
            res.send(data)
        })
        .catch(err => next(err));
}

function googleAuthenticate(req, res, next){
    authController.registerGoogleAccount( {"code": req.query.code} )
        .then(data => {
            res.cookie('token', data.token).send()
        })
        .catch(err => next(err));
}

function getGoogleAuthURL (req,res,next){
    res.redirect(googleAPI.getAuthURL());
}

module.exports = router;