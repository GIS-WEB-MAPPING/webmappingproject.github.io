var map = L.map('map').setView([29.8884, -97.9384], 14);
  mapLink =
      '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
      }).addTo(map);

import { point, bearing } from '@turf/turf';
const point1 = point([33.1434, -117.166]);
const point2 = point([33.1434, -117.466]);
const angle = bearing(point1, point2);
console.log(`Bearing: ${angle} degrees`);
