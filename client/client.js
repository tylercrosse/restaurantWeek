function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 47.634536, lng: -122.334981}
  });

  const infowindow = new google.maps.InfoWindow();
  const service = new google.maps.places.PlacesService(map);

  loadJSON('../server/data/restaurant_geo.json')
    .then((json) => {
      return JSON.parse(json)
    })
    .then((restaurants) => {
      const hoverInfoWindow = new google.maps.InfoWindow();
      const clickInfoWindow = new google.maps.InfoWindow();
      map.data.addGeoJson(restaurants);
      map.data.addListener('click', function(event) {
        const content = (
          `<div>
            <strong>${event.feature.getProperty('name')}</strong>
            <br>
            Rating: ${event.feature.getProperty('rating')} stars
            <br>
            ${event.feature.getProperty('formatted_address')}
          </div>`
        );
        hoverInfoWindow.close();
        clickInfoWindow.setContent(content);
        clickInfoWindow.setPosition(event.latLng);
        clickInfoWindow.open(map, this);
      });
      map.data.addListener('mouseover', function(event) {
        const content = (
          `<div>
            <strong>${event.feature.getProperty('name')}</strong>
            <p> ${event.feature.getProperty('rating')} stars</p>
          </div>`
        )
        hoverInfoWindow.setContent(content);
        hoverInfoWindow.setPosition(event.latLng);
        hoverInfoWindow.open(map, this);
      })
      map.data.addListener('mouseout', function(event) {
        hoverInfoWindow.close();
      })
    })
    .catch((err) => {console.log('❌ Error:', err)});

  map.data.setStyle((feature) => {
    const rating = feature.getProperty('rating');
    return {
      icon: getCircle(rating)
    };
  });

  function getCircle(rating) {
    const maxRating = 5;
    const minRating = 2.8;
    const scaledRating = 20 * (rating - minRating) / (maxRating - minRating);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: .2,
      scale: scaledRating,
      strokeColor: 'white',
      strokeWeight: .5
    };
  };

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
