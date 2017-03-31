const Promise          = require('bluebird');
const fs               = require('fs');
const googleMapsAPIKey = require('./secrets.json').googleMapsAPIKey
const restaurantNames  = require('./data/restaurantNames.json');
const googleMapsClient = require('@google/maps').createClient({
  key: googleMapsAPIKey,
  Promise
})

console.log(googleMapsAPIKey);

const seattleLatLng = {lat: 47.6062, lng: -122.3321}
const first4 = restaurantNames.slice(0, 4);
const restaurantBuffer = [];

const getPlace = (name) => {
  console.log('🔍: ', name);
  const options = {
    query: name,
    location: seattleLatLng,
    type: 'food'
  }
  return googleMapsClient.places(options).asPromise()
    .then((response) => {
      console.log('✅: ', name);
      return response.json.results;
    })
    .catch((err) => {
      if (err) {
        console.log('❌ Places Error for %s: ', name, err)
      }
    });
};

Promise.map(restaurantNames, getPlace, {concurrency: 1})
  .then((results) => {
    restaurantBuffer.push(results);
  })
  .then(() => {
    fs.writeFile('./data/restaurantData3.json', JSON.stringify(restaurantBuffer), (err) => {
      if (err) throw err;
      console.log('The file has been saved! 🎊😃');
    });
  })
  .catch((err) => {
    if (err) {
      console.log('❌ Error in someplace in Promise.map: ', err)
    }
  });
