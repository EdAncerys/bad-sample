import React, { useState, useRef } from "react";
import { connect } from "frontity";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import Loading from "../loading";
import PinIcon from "../../img/svg/pinIcon.svg";
import { colors } from "../../config/imports";

const mapCenter = {
  lat: 37.7824134,
  lng: -122.4088472,
};

const MARKER_POSITION = {
  lat: 37.772,
  lng: -122.214,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapsComponent = ({ state, actions, libraries }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: state.auth.GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const mapRef = useRef(null);
  const [position, setPosition] = useState({
    lat: 41,
    lng: -71,
  });

  // const BANNER_HEIGHT = state.theme.bannerHeight;

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
    mapRef.current = null;
  }, []);

  function handleLoad(map) {
    mapRef.current = map;
  }

  function handleCenter() {
    if (!mapRef.current) return;

    const newPos = mapRef.current.getCenter().toJSON();
    setPosition(newPos);
  }

  // return isLoaded ? (
  //   <GoogleMap
  //     mapContainerStyle={containerStyle}
  //     defaultZoom={12}
  //     defaultCenter={center}
  //     onLoad={onLoad}
  //     onUnmount={onUnmount}
  //   >
  //     <>Child components, such as markers, info windows, etc.</>
  //   </GoogleMap>
  // ) : (
  //   <></>
  // );

  if (isLoaded)
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultZoom={12}
        center={mapCenter}
        onLoad={onLoad}
        onUnmount={onUnmount}

        // onLoad={handleLoad}
        // onDragEnd={handleCenter}
        // center={mapCenter}
      >
        <Marker position={MARKER_POSITION} icon={PinIcon} />
      </GoogleMap>
    );

  return <Loading />;
};

export default connect(MapsComponent);
