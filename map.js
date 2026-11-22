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
  const historicalPane = map.createPane('historicalPane');
  historicalPane.style.zIndex = 420;

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
    console.log('2006 historical locations loaded');
  });
  currentLayer.on('load', function() {
    console.log('Current Buc-ee locations loaded');
  });
  plannedLayer.on('load', function() {
    console.log('Planned Buc-ee locations loaded');
  });

  const divider = L.DomUtil.create(
    'div',
    'swipe-divider'
  );
  map.getContainer().appendChild(divider);
  function updateSlider(position) {
    position = Math.max(0, Math.min(100, position));
    historicalPane.style.clipPath =
        `inset(0 ${100 - position}% 0 0)`;
    currentPane.style.clipPath =
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
    const div = L.DomUtil.create(
        'div',
        'info legend'
    );
    div.innerHTML = `
        <strong>Buc-ee's Locations</strong><br>
        <span style="color:#2166ac;">●</span>
        2006 Locations<br>
        <span style="color:#d73027;">●</span>
        Current Locations<br>
        <span style="color:#fdae61;">●</span>
        Planned Locations
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
