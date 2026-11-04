var map = L.map('map').setView([29.8884, -97.9384], 14);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
var carto_api_key = 'cb1_4dob_1_eb95857fcdb8ab26ee79db28';
L.tileLayer(
  'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + carto_api_key, {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
  }).addTo(map);

  const webMapId = 'd76f7166f7cf409895b8b95219ace470';

  fetch(`https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`)
    .then(response => response.json())
    .then(webMap => {
      console.log("ArcGIS Web Map:", webMap);
      webMap.operationalLayers.forEach(layer => {
        if (layer.url && layer.url.includes('/FeatureServer')) {
          L.esri.featureLayer({
            url: layer.url
          }).addTo(map);
        }
        else if (layer.url && layer.url.includes('/MapServer')) {
          L.esri.dynamicMapLayer({
            url: layer.url,
            opacity: 0.8
          }).addTo(map);
        }
      });
    })
