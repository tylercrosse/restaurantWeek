const fs             = require('fs');
const json2csv       = require('json2csv');
const restaurantData = require('./data/flatData.json');

const fields = [
  'name',
  'rating',
  'price_level',
  'formatted_address',
  'geometry.location.lat',
  'geometry.location.lng',
  'id',
];

try {
  const result = json2csv({ data: restaurantData, fields });
  fs.writeFile('./data/restaurantData.csv', result, (err) => {
    if (err) throw err;
    console.log('The file has been saved! 🎊😃');
  });
} catch (err) {
  console.log(err);
}
