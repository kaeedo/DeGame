import {SolidLeafletMap} from "solidjs-leaflet"
import geojson from './assets/laender.json?raw'
import stations from './assets/stations.json?raw';

function App() {
  const a = JSON.parse(geojson)

  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const b = JSON.parse(stations)

  return (
    <>
      <div>
      <SolidLeafletMap
      center={[51.165691, 10.451526]}
      id="map"
      zoom={6}
      onMapReady={(l, m) => {
        l.geoJSON(a).addTo(m);
        l.geoJSON(b, {pointToLayer:(feature:any,latLng:any) => l.circleMarker(latLng, geojsonMarkerOptions)}).addTo(m);
      }}
    />
      </div>
    </>
  )
}

export default App
