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


  const currentPane = map.createPane('currentPane');
  currentPane.style.zIndex = 420;


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
              pane: 'historicalPane',
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
            pane: 'currentPane',
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
            pane: 'currentPane',
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

  historicalLayer.on('load', function() {
    const slider = document.querySelector('#mapSwipe');
    if (slider) updateSlider(slider.value);
  });
  currentLayer.on('load', function() {
      const slider = document.querySelector('#mapSwipe');
      if (slider) updateSlider(slider.value);
  });
  plannedLayer.on('load', function() {
      const slider = document.querySelector('#mapSwipe');
      if (slider) updateSlider(slider.value);
  });
    const divider = L.DomUtil.create(
      'div',
      'swipe-divider'
  );
  map.getContainer().appendChild(divider);

    function updateSlider(position) {
      position = Math.max(0, Math.min(100, Number(position)));
      const mapRect = map.getContainer().getBoundingClientRect();
      const mapWidth = mapRect.width;
      const mapHeight = mapRect.height;
      if (mapWidth === 0 || mapHeight === 0) return;
      const dividerPosition = mapWidth * position / 100;
      const dividerX = mapRect.left + dividerPosition;
      const historicalSVG =
          historicalPane.querySelector('svg');
      const currentSVG =
          currentPane.querySelector('svg');
      if (historicalSVG) {
          const rect = historicalSVG.getBoundingClientRect();
          const top = mapRect.top - rect.top;
          const right = rect.right - dividerX;
          const bottom = rect.bottom - mapRect.bottom;
          const left = mapRect.left - rect.left;
          historicalSVG.style.clipPath =
              `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      }

      if (currentSVG) {
          const rect = currentSVG.getBoundingClientRect();
          const top = mapRect.top - rect.top;
          const right = rect.right - mapRect.right;
          const bottom = rect.bottom - mapRect.bottom;
          const left = dividerX - rect.left;
          currentSVG.style.clipPath =
              `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      }

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
