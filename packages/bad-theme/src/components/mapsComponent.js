import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "800px",
  height: "400px",
};

const center = {
  lat: 51.5072178,
  lng: -0.1275862,
};

const MapsComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HY1FKYgS-Tdiq0uG0J6T-c3_CPed5mo",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div style={{ position: "relative", height: 500 }}>
      <div style={{ position: "absolute", backgroundColor: colors.primary }}>
        {/* <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <>Child components, such as markers, info windows, etc.</>
        </GoogleMap> */}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default connect(MapsComponent);
