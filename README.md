# Auth-API
This a template for user signup and authentication using Express, JWT, Bcrypt and Mongoose.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone git@github.com:devansh016/Auth-API.git
npm install
npm start
```
## Environment Variable Required
```sh
JWT_SECRET = "ABCD" 
MONGODB_URL = "ABCD"
GOOGLE_CLIENT_ID = "ABCD"
GOOGLE_CLIENT_SECRET = "ABCD"
GOOGLE_REDIRECT_URL = "http://localhost/api/auth/google-authenticate"
```

Your app should now be running on [localhost](http://localhost/) at port 80.
