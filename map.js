var map = L.map('map').setView([29.8884, -97.9384], 14);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    }
).addTo(map);

var center = [-95.789, 45.244];
var radius = 15;
var options = { steps: 20, units: "miles", properties: { foo: "bar" } };
var circle = L.circle([51.508, -0.11], {
  color: 'blue',
  fillColor: '#00f',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);

import { point, bearing } from '@turf/turf';
const point1 = point([33.1434, -117.166]);
const point2 = point([33.1434, -117.466]);
const angle = bearing(point1, point2);
console.log(`Bearing: ${angle} degrees`);

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
