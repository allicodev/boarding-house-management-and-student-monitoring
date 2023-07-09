import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const Map = ({ coordinates }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLEMAP_API_KEY,
  });
  const center = useMemo(() => ({ ...coordinates }), []);

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
          options={{
            mapTypeId: google.maps.MapTypeId.HYBRID,
          }}
          layerTypes={["TrafficLayer", "TransitLayer"]}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
