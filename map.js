var map = L.map('map').setView([29.8884, -97.9384], 14);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
var carto_api_key = 'cb1_4dob_1_eb95857fcdb8ab26ee79db28';
L.tileLayer(
  'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + carto_api_key, {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
  }).addTo(map);

  const iconSymbol = L.icon({
      iconUrl: 'https://img.icons8.com/?size=100&id=73aABFv7KJOX&format=png&color=000000',
      iconSize: [24, 24],
      iconAnchor: [0, 25]
    });

  const webMapIds = [
    'd76f7166f7cf409895b8b95219ace470',
    '6f252d54f28a463ba592bd3d6c9e90d9'
  ]

  let currentMapIndex = 0;
  let currentLayers = [];

  const slider = L.control({ position: 'topright' });
    slider.onAdd = function(map) {
        const container = L.DomUtil.create('div', 'map-slider');
          container.innerHTML = `
                <label><b>Switch Web Maps</b></label>
                <input
                  id="webMapSlider"
                  type="range"
                  min="0"
                  max="1"
                  step="1"
                  value="0"
                  />
                  <div id="sliderLabel">Map 1</div>
                `;
        L.DomEvent.disableClickPropagation(container);
        return container;
    };
    slider.addTo(map);
      function loadWebMap(index) {
      currentMapIndex = index;
      document.getElementById('sliderLabel').innerText =
          index === 0 ? 'Map 1' : 'Map 2';
      currentLayers.forEach(layer => map.removeLayer(layer));
      currentLayers = [];
      const webMapId = webMapIds[index];

  fetch(`https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`)
    .then(response => response.json())
    .then(webMap => {
        console.log("ArcGIS Web Map:", webMap);
        webMap.operationalLayers.forEach(layer => {
            if (layer.url && layer.url.includes('/FeatureServer')) {
              const feature = L.esri.featureLayer({
                url: layer.url,
                pointToLayer: function (geojson, latlng) {
                    return L.marker(latlng, {
                        icon: iconSymbol
                    });
                }
              }).addTo(map);
              currentLayers.push(feature);
            } else if (layer.url && layer.url.includes('/MapServer')) {
              const dynamic = L.esri.dynamicMapLayer({
                url: layer.url,
                opacity: 0.8
              }).addTo(map);
              currentLayers.push(dynamic);
            }
        });
    })

      document.getElementById('webMapSlider').addEventListener('input', function() {
          loadWebMap(Number(this.value));
      });
      loadWebMap(0);
