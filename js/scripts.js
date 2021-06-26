// Mapa Leaflet
var mapa = L.map('mapid').setView([9.94189, -84.01394], 14);


// Definición de capas base
var capa_ESRI = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	  maxZoom: 19
    }
).addTo(mapa);

var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

var capa_cartoDB_darkMatter = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	  subdomains: 'abcd',
	  maxZoom: 19
    }
).addTo(mapa);

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "Capa ESRI": capa_ESRI,
  "CartoDB Dark Matter": capa_cartoDB_darkMatter
};	    

// Ícono personalizado para Construcciones
const iconoConstr = L.divIcon({
  html: '<i class="fas fa-house-user fa-2x"></i>',
  className: 'estiloIconos'
});

// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);
   
// Capa vectorial de rios en formato GeoJSON
$.getJSON("https://raw.githubusercontent.com/MontserratJB/Proyecto/master/capas/rios.geojson", function(geodata) {
  var capa_rios = L.geoJson(geodata, {
    style: function(feature) {
	  return {'Size': 1, 'color': "#0000FF", 'weight': 1.5, 'fillOpacity': 0.0}
    }    			
  }).addTo(mapa);

  control_capas.addOverlay(capa_rios, 'Rios');
});	

// Capa vectorial de zonas de proteccion en formato GeoJSON
$.getJSON("https://raw.githubusercontent.com/MontserratJB/Proyecto/master/capas/zonas_retiro.geojson", function(geodata) {
  var capa_zproteccion = L.geoJson(geodata, {
    style: function(feature) {
	  return {'Size': 1, 'color': "#00aae4", 'weight': 1, 'fillOpacity': 0.4}
    }    			
  }).addTo(mapa);

  control_capas.addOverlay(capa_zproteccion, 'Zonas de protección');
});	

 //Capa raster mapa de calles
var capa_mcalles = L.imageOverlay("https://github.com/MontserratJB/Proyecto/blob/master/capas/fondo_calles_wgs.png?raw=true", 
	[[9.8932044872776181, -84.0915314244829091], 
	[9.9841244436038057, -83.9376433699016786]], 
	{opacity:0.6}
).addTo(mapa);
control_capas.addOverlay(capa_mcalles, 'Mapa de Calles');

function updateOpacity() {
  document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
  capa_mcalles.setOpacity(document.getElementById("sld-opacity").value);
}
  
// Agregar capa WMS de distritos
var capa_distritos = L.tileLayer.wms('https://geos.snitcr.go.cr/be/IGN_5/wms?', {
  layers: 'limitedistrital_5k',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

// Se agrega al control de capas como de tipo "overlay"
control_capas.addOverlay(capa_distritos, 'Distritos');
  
// Capa vectorial de Construcciones en zonas de proteccion 
$.getJSON("https://raw.githubusercontent.com/MontserratJB/Proyecto/master/capas/const_zon_prot.geojson", function(geodata) {
  // Capa de registros individuales
  var capa_constr = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoConstr});
    }
  });

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_constru_calor = L.heatLayer(coordenadas, {radius: 15, blur: 20, max: 0.03});

  // Se añaden las capas al mapa y al control de capas
  capa_constru_calor.addTo(mapa);
  control_capas.addOverlay(capa_constru_calor, 'Construcciones');
  
});
   
  
  
