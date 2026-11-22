const map = L.map('map').setView([29.8884, -97.9384], 7);
L.tileLayer(
    'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20
    }
).addTo(map);

  const currentPane = map.createPane('currentPane');
  currentPane.style.zIndex = 410;

  const oldPane = map.createPane('oldPane');
  oldPane.style.zIndex = 420;

  const leftServiceURL =
  'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/0';
  const rightServiceURL =
  'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/1';

  const currentLayer = L.esri.featureLayer({
      url: leftServiceURL,
      pane: 'currentPane',

      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
              radius: 7,
              fillColor: '#2166ac',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.9
          });
      }
  });

  const oldLayer = L.esri.featureLayer({
      url: rightServiceURL,
      pane: 'oldPane',

      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
              radius: 7,
              fillColor: '#d73027',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.9
          });
      }
  });

  currentLayer.addTo(map);
  oldLayer.addTo(map);

  let sliderPosition = 50;

  const divider = L.DomUtil.create('div', 'swipe-divider');

  map.getContainer().appendChild(divider);

  function updateSlider(position) {

      sliderPosition = position;
      currentPane.style.clipPath =
          `inset(0 ${100 - position}% 0 0)`;
      oldPane.style.clipPath =
          `inset(0 0 0 ${position}%)`;
      divider.style.left = position + '%';
  }

  const SwipeControl = L.Control.extend({
      options: {
          position: 'bottomleft'
      },
      onAdd: function(map) {
          const container = L.DomUtil.create(
              'div',
              'swipe-control'
          );
          container.innerHTML = `
              <label for="mapSwipe">
                  Compare Locations
              </label>
              <input
                  type="range"
                  id="mapSwipe"
                  min="0"
                  max="100"
                  value="50"
                  step="1"
              >
          `;
          L.DomEvent.disableClickPropagation(container);
          const slider = container.querySelector('#mapSwipe');
          slider.addEventListener('input', function() {
              updateSlider(Number(this.value));
          });
          return container;
      }
  });

  map.addControl(new SwipeControl());

  const legend = L.control({
      position: 'bottomright'
  });
  legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
          <strong>Buc-ee's Locations</strong><br>
          <span style="color:#2166ac;">●</span>
          Current Locations<br>
          <span style="color:#d73027;">●</span>
          2006 Locations
      `;
      div.style.background = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.lineHeight = '1.7';
      return div;
  };
  legend.addTo(map);
  updateSlider(50);

  setTimeout(function() {
      map.invalidateSize();
  }, 200);
