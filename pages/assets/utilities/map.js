import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const Map = ({ coordinates, styles }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLEMAP_API_KEY,
  });
  const center = useMemo(() => ({ ...coordinates }), []);

  return (
    <div className="App" style={styles}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
          options={{
            mapTypeId: google.maps.MapTypeId.HYBRID,
            fullscreenControl: false,
            zoomControl: false,
            keyboardShortcuts: false,
          }}
          layerTypes={["TrafficLayer", "TransitLayer"]}
          onClick={(e) => console.log(e.latLng.ln)}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
