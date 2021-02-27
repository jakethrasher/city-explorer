const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');
const { locationResponse, weatherMunge } = require('./mungeUtils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/location', async(req, res) => {
  try {
    const city = req.query.search;

    const locationData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODING_API_KEY}&q=${city}&format=json`);

    const formatedResponse = locationResponse(locationData.body);

    res.json(formatedResponse);

  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;

    const weatherRequest = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`);
    
    const formattedResponse = weatherMunge(weatherRequest.body);
    res.json(
      formattedResponse
    );
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});
function mungeReview(reviewData){
  return reviewData.body.businesses.map(item=>({
    name: item.name,
    image_url: item.image_url,
    price:item.price,
    rating: item.rating,
    url: item.url,
  }));
}
app.get('/reviews', async(req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    // const lat = 45.5202471;
    // const lng = -122.6741949;

    const yelpRequest = await request.get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`).set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    const formattedResponse = mungeReview(yelpRequest);
    res.json(
      formattedResponse 
    );

  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});
    
app.use(require('./middleware/error'));

module.exports = app;
