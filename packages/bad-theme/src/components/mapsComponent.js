import React from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 1.5072,
  lng: 0.1276,
};

const MapsComponent = ({ state, actions, libraries }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HY1FKYgS-Tdiq0uG0J6T-c3_CPed5mo",
  });

  const [map, setMap] = React.useState(null);

  const BANNER_HEIGHT = state.theme.bannerHeight;

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      defaultZoom={8}
      defaultCenter={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <>Child components, such as markers, info windows, etc.</>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default connect(MapsComponent);
