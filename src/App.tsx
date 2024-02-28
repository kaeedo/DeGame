import {SolidLeafletMap} from "solidjs-leaflet"
import geojson from './assets/laender.json?raw'

function App() {
  const a = JSON.parse(geojson)

  return (
    <>
      <div>
      <SolidLeafletMap
      center={[-104.99404, 39.75621]}
      id="map"
      zoom={10}
      onMapReady={(l, m) => {
        l.geoJSON(a).addTo(m);
      }}
    />
      </div>
    </>
  )
}

export default App
