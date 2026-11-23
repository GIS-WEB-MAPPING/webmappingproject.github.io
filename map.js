  const carto_api_key = 'cb1_4dob_1_eb95857fcdb8ab26ee79db28';
  const map = L.map('map').setView([29.8884, -97.9384], 7);
  L.tileLayer(
      'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + carto_api_key,
      {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 20
      }
  ).addTo(map);


  const historicalPane = map.createPane('historicalPane');
  historicalPane.style.zIndex = 410;
  historicalPane.style.pointerEvents = 'auto';

  const currentPane = map.createPane('currentPane');
  currentPane.style.zIndex = 420;
  currentPane.style.pointerEvents = 'auto';

  const locationsURL =
      'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/0';
  const plannedURL =
      'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/1';

  const historicalFilter = `
      Address = '899 Oyster Creek Dr'
      OR Address = '101 N Hwy 2004'
      OR Address = '801 N Brooks'
      OR Address = '4231 E. Hwy 332'
      OR Address = '2375 E Austin St'
      OR Address = '780 Hwy 35 N Byp'
      OR Address = '2299 E Mulberry St'
      OR Address = '931 Loop 274'
      OR Address = '2304 W Mulberry St'
      OR Address = '2541 S Main St'
      OR Address = '505 E Main St'
      OR Address = '10070 W IH 10'
  `;

  const historicalLayer = L.esri.featureLayer({
      url: locationsURL,
      where: historicalFilter,
      pane: 'historicalPane',

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

  const currentLayer = L.esri.featureLayer({
      url: locationsURL,
      pane: 'currentPane',
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

  const plannedLayer = L.esri.featureLayer({
      url: plannedURL,
      pane: 'currentPane',
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
              radius: 7,
              fillColor: '#fdae61',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.9
          });
      }
  });

  historicalLayer.addTo(map);
  currentLayer.addTo(map);
  plannedLayer.addTo(map);


    const divider = L.DomUtil.create(
      'div',
      'swipe-divider'
  );
  map.getContainer().appendChild(divider);

  function updateSlider(position) {
    position = Math.max(0, Math.min(100, Number(position)));
    const mapSize = map.getSize();
    if (mapSize.x === 0 || mapSize.y === 0) return;
    const dividerPosition = mapSize.x * position / 100;
    historicalPane.style.clipPath =
        `inset(0 ${100 - position}% 0 0)`;
    currentPane.style.clipPath =
        `inset(0 0 0 ${position}%)`;
    divider.style.left = dividerPosition + 'px';
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
                  Compare Buc-ee's Growth
              </label>
              <input
                  type="range"
                  id="mapSwipe"
                  min="0"
                  max="100"
                  value="50"
                  step="1"
              >
              <div class="slider-labels">
                  <span>2006</span>
                  <span>Current</span>
              </div>
          `;
          L.DomEvent.disableClickPropagation(container);
          L.DomEvent.disableScrollPropagation(container);
          const slider = container.querySelector('#mapSwipe');
          slider.addEventListener('input', function() {
              updateSlider(this.value);
          });
          return container;
      }
  });

  map.addControl(new SwipeControl());

  map.on('move zoom resize', function() {
      const slider = document.querySelector('#mapSwipe');
      if (slider) {
          updateSlider(slider.value);
      }
  });

  updateSlider(50);

  map.whenReady(function() {
    map.invalidateSize();
    updateSlider(50);
  });
