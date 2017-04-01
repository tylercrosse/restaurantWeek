function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 47.634536, lng: -122.334981}
  });

  const infowindow = new google.maps.InfoWindow();
  const service = new google.maps.places.PlacesService(map);

  loadJSON('../server/data/flatData.json')
    .then((json) => {
      return JSON.parse(json)
    })
    .then((restaurants) => {
      restaurants.forEach((restaurant) => {
        const marker = new google.maps.Marker({
          map: map,
          position: restaurant.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(
`<div>
  <strong>${restaurant.name}</strong>
  <br>
  Rating: ${restaurant.rating}
  <br>
  ${restaurant.formatted_address}
</div>`
          );
          infowindow.open(map, this);
        });
      });
    })
    .catch((err) => {console.log('❌ Error:', err)});

  // service.getDetails({
  //   placeId: '587ff1bc92d40ca5f6bfc70786dec8f3305d8b53'
  // }, function(place, status) {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     const marker = new google.maps.Marker({
  //       map: map,
  //       position: place.geometry.location
  //     });
  //     google.maps.event.addListener(marker, 'click', function() {
  //       infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
  //         'Place ID: ' + place.place_id + '<br>' +
  //         place.formatted_address + '</div>');
  //       infowindow.open(map, this);
  //     });
  //   }
  // });
}

function loadJSON(src) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', src, true);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(null);
  })
}

function addMapSrc(json) {
  const { googleMapsAPIKey } = JSON.parse(json)
  const src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places&callback=initMap`
  const el = document.createElement('script');
  el.setAttribute('src', src);
  el.setAttribute('async', true);
  el.setAttribute('defer', true);
  document.body.appendChild(el);
}

loadJSON('../secrets.json', addMapSrc)
  .then((json) => {
    addMapSrc(json)
  })
  .catch((err) => {console.log('❌ Error:', err)});
