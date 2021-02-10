const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");
const app = express();
const clients = require('./modules/clients/routes/clientsRoute');
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => {
  console.log(`NodeJS+DynamoDB boilerplate API listening on port ${PORT}!`)
});

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.DB_ENDPOINT
});


//Google Auth
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine','ejs');

app.use('/clients',clients);

// Routes
app.get('/', function (req, res) {
  res.render('login');
})

app.post('/', (req, res) => {
  let token = req.body.token;
  console.log(token);
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    const domain = payload['hd'];
    console.log(payload);
  }
  verify().
  then(()=>{
      res.cookie('session-token', token );
      res.send('success');
  }).catch(console.error);
});

app.get('/dashboard', checkAuthenticated , (req,res)=>{
  let user = req.user;
  res.render('dashboard', {user});
});

app.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/');
});

function checkAuthenticated(req, res, next) {
  let token = req.cookies['session-token'];

  let user = {};

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    console.log({picture: payload.picture});
  }
  verify().
  then(()=>{
    req.user = user;
    next();
  }).catch(err=>{
    res.redirect('/');
  })
}
module.exports = app;
