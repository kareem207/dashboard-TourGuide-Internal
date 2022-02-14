var express = require('express');
const date = require('date-and-time');

var router = express.Router();

var admin = require('./admin');
var system = require('./system');
var chartsData = require('./chartsData');
const session = require('express-session');

const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

require('dotenv').config();

var app = express();

app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));



router.get('/login', async function(req, res) {

  if (req.session.loggedin == true){
    res.redirect('/index');
  }
  else res.render('login');
});

router.post('/auth', async function(req, res) {
  let username = req.body.InputUserName;
	let password = req.body.InputPassword;

  if (username && password) {
    var resultArray = await system.checkLogin(username,password);

    if (resultArray.length>0){
      var CheckAdmin = resultArray[0].admin;
      req.session.loggedin = true;
      req.session.loggedAdmin = CheckAdmin;      
      req.session.username = username;
    }
    else req.session.loggedin = false;
  }


  if (req.session.loggedin == true) res.redirect('/index');
  
  else res.redirect('/login');


});

router.get('/logout', async function(req, res) {
req.session.loggedin = false
console.log("hey im out now");
res.render('login');
});


/* GET home page. */
router.get('/', async function(req, res, next) {

  if (req.session.loggedin == true){
    selectTotal = await chartsData.selectTotals();
    res.render('index', { selectTotalVar: selectTotal });
  }
  else res.redirect('/login');

});

router.get('/index', async function(req, res, next) {
  if (req.session.loggedin == true){
    selectTotal = await chartsData.selectTotals();
    res.render('index', { selectTotalVar: selectTotal });
  }
  else res.redirect('/login');

});

router.get('/getChartsData', async function(req, res, next) {

  if (req.session.loggedin == true){
    incomePerMonth = await chartsData.incomePerMonth();
    travllersPerTrip = await chartsData.travllersPerTrip();
    var data = {
      incomePerMonth:incomePerMonth,
      travllersPerTrip:travllersPerTrip
    }
    res.json(data);
  }
  else res.redirect('/login');

});


router.get('/register', async function(req, res, next) {
  if (req.session.loggedin == true){
    res.render('register');
    console.log("hey im in");
  }
  else res.redirect('/login');
});

router.get('/searchAllUsers', async function(req, res, next) {
  if (req.session.loggedin == true){
    selectAllUsers = await admin.selectAllUsers();
    res.render('searchAllUsers', {selectAllUsersVar: selectAllUsers});
  }
  else res.redirect('/login');

});

router.get('/searchFinancialOfUsers', async function(req, res, next) {
  if (req.session.loggedAdmin == '1' && req.session.loggedin == true){
    selectUnpaidTripsK = await admin.selectUnpaidTripsK();
    res.render('searchFinancialOfUsers', {selectAllUsersVar: selectUnpaidTripsK});
  }
  else if (req.session.loggedin == true) {
    res.render('cantAccess');

  }
    
  else res.redirect('/login');

});

router.get('/upComingTrips', async function(req, res, next) {
  if (req.session.loggedin == true){
    selectUpComingBooking = await admin.selectUpComingBooking();
    res.render('upComingTrips', {selectUpComingBookingVar: selectUpComingBooking});
  }
  else res.redirect('/login');
});

//redirect routers
router.get('/updateUser', async function(req, res) {
  if (req.session.loggedin == true){
    var phoneN = req.query['phoneN'];
    var tripName = req.query['tripName'];
  
    //get the data in the orgianl shape of it after changing it in the priveous step in file "serachAllUsers.js" in "editBut" function
    phoneN = await admin.decodePhoneN(phoneN);
    const query = await admin.getUserData(phoneN,tripName);
    console.log(query);
    res.render('updateUser', {data:query[0]});
  }
  else res.redirect('/login');

});

router.get('/submitDeleteTripBut', async function(req, res) {
  var phoneN = req.query['phoneN'];
  var tripName = req.query['tripName'];
  phoneN = await admin.decodePhoneN(phoneN);
  await admin.deleteUserTrip(phoneN,tripName);
  res.redirect('/searchAllUsers');
});


router.post('/submitUpdateUserBut', async function(req, res) {
  const data = await req.body;
  await admin.updateUserData(data);
  res.redirect('/searchAllUsers');
});


router.post('/submitPaidK', async function(req, res) {
  const data = await req.body;
  console.log(data);
  await admin.changeToPaidTripK(data.phone,data.tripName);
  res.redirect('/');
});


router.post('/insertUser', async function(req, res) {
    const data = await req.body;
    console.log("Hey can you see me im in the new link");
    admin.InsertNewUser(data);
    console.log("dataBased to insertNEw user");

    res.redirect('/');

});




module.exports = router;
