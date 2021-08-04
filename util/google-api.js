const NodeGoogleLogin = require('node-google-login');
require('dotenv').config();

const config = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectURL: process.env.GOOGLE_REDIRECT_URL,
  defaultScope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]
}

const googleLogin = new NodeGoogleLogin(config);

// Generate Auth URL
const authURL = googleLogin.generateAuthUrl()
function getAuthURL(){
    return authURL;
}


// Get User Profiles and Access Tokens by passing the Auth code recieved from generateAuthUrl(). 
// Access token & refresh token are passed along with the response object

function getUserAccount(code){
  return new Promise(async (resolve,reject)=>{
    try {
        googleLogin.getUserProfile(code).then(userProfile => {
        resolve(userProfile)
        return userProfile;
      })
    } catch (error) {
        reject(error)
    }
  })
};


module.exports = {
  getAuthURL,
  getUserAccount
};