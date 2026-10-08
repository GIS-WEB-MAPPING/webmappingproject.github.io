var map = L.map('map').setView([29.8884, -97.9384], 14);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
var carto_api_key = 'cb1_4dob_1_eb95857fcdb8ab26ee79db28';
L.tileLayer(
  'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + carto_api_key, {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
  }).addTo(map);

var center = [-95.789, 45.244];
var radius = 15;
var options = { steps: 20, units: "miles", properties: { foo: "bar" } };
var circle = L.circle([51.508, -0.11], {
  color: 'blue',
  fillColor: '#00f',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);

// import { point, bearing } from '@turf/turf';
// const point1 = point([33.1434, -117.166]);
// const point2 = point([33.1434, -117.466]);
// const angle = bearing(point1, point2);
// console.log(`Bearing: ${angle} degrees`);

  var polygon = turf.polygon(
    [
      [
        [-5, 52],
        [-4, 56],
        [-2, 51],
        [-7, 54],
        [-5, 52],
      ],
    ],
    {name: "poly1"},
  );

  // COURTNEY'S TURF.JS FUNCTION

  function calculateDistance() {


    var point1 = turf.point([-97.9384, 29.8884]);
    var point2 = turf.point([-97.9000, 29.9100]);


    var distance = turf.distance(point1, point2, {
      units: 'miles'
    });


    L.marker([29.8884, -97.9384])
      .addTo(map)
      .bindPopup("Starting Point");


    L.marker([29.9100, -97.9000])
      .addTo(map)
      .bindPopup("Ending Point");


    L.popup()
      .setLatLng([29.8884, -97.9384])
      .setContent(
        "The distance between the two points is " +
        distance.toFixed(2) +
        " miles."
      )
      .openOn(map);


    console.log(
      "Distance between the two points: " +
      distance.toFixed(2) +
      " miles"
    );
  }

  calculateDistance();
