const fs             = require('fs');
const restaurantData = require('./data/flatData.json');

const restaurantGeoJSON = {
  type: 'FeatureCollection',
  features: restaurantData.map((restaurant) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [restaurant.geometry.location.lng, restaurant.geometry.location.lat]
    },
    properties: restaurant
  }))
}

fs.writeFile('./server/data/restaurant_geo.json', JSON.stringify(restaurantGeoJSON), (err) => {
  if (err) throw err;
  console.log('The file has been saved! 🎊😃');
});
