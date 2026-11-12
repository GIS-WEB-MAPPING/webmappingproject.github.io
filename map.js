var map = L.map('map').setView([29.8884, -97.9384], 14);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
var carto_api_key = 'cb1_4dob_1_eb95857fcdb8ab26ee79db28';
L.tileLayer(
  'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + carto_api_key, {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
  }).addTo(map);

  const leftWebMapId = 'd76f7166f7cf409895b8b95219ace470';
  const rightWebMapId = '6f252d54f28a463ba592bd3d6c9e90d9';

  const iconSymbol = L.icon({
  iconUrl: 'https://img.icons8.com/?size=100&id=73aABFv7KJOX&format=png&color=000000',
  iconSize: [24, 24],
  iconAnchor: [12, 25]
  });

  const leftLayers = []
  const rightLayers = []

  async function loadWebMap(webMapId, layerGroup) {
    const response = await fetch(`https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Web Map: ${webMapId}`);
    }
    const webMap = await response.json();
    console.log("Loaded Web Map:", webMap);
    if (!webMap.operationalLayers) {
      throw new Error("No operational layers found");
    }
    webMap.operationalLayers.forEach(layer => {
      if (layer.url && layer.url.includes('/FeatureServer')) {
        const newLayer = L.esri.featureLayer({
          url: layer.url,
          pointToLayer: function (geojson, latlng) {
            return L.marker(latlng, {
              icon: iconSymbol
            });
          }
        });
        newLayer.addTo(map);
        layerGroup.push(newLayer);
      }
      else if (layer.url && layer.url.includes('/MapServer')) {
        const newLayer = L.esri.dynamicMapLayer({
          url: layer.url,
          opacity: 0.8
        });
        newLayer.addTo(map);
        layerGroup.push(newLayer);
      }
    });
    }
    Promise.all([
    loadWebMap(leftWebMapId, leftLayers),
    loadWebMap(rightWebMapId, rightLayers)
    ])
    .then(() => {
    console.log("Both Web Maps loaded!");
    console.log("Left layers:", leftLayers);
    console.log("Right layers:", rightLayers);
    const swipe = L.control.sideBySide(
      leftLayers,
      rightLayers
    );
    swipe.addTo(map);
    })
