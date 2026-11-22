  var map = L.map('map').setView([29.8884, -97.9384], 14);
  L.tileLayer(
    'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 20
    }
  ).addTo(map);
  const leftServiceURL =
    'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/0';
  const rightServiceURL =
    'https://services9.arcgis.com/SfvtKAxCn62UWpRg/arcgis/rest/services/Buc_ee_s_Locations_WFL1/FeatureServer/1';

  const leftLayer = L.esri.featureLayer({
    url: leftServiceURL,
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

  const rightLayer = L.esri.featureLayer({
    url: rightServiceURL,
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

  leftLayer.addTo(map);
  rightLayer.addTo(map);

  const slider = L.control.sideBySide(
    leftLayer,
    rightLayer
  );

  slider.addTo(map);

  const legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
      <strong>Buc-ee's Locations</strong><br>
      <span style="color:#2166ac;">●</span> Current Locations<br>
      <span style="color:#d73027;">●</span> 2006 Locations
    `;
    div.style.background = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    return div;
  };
  legend.addTo(map);

  setTimeout(function() {
    map.invalidateSize();
  }, 200);
