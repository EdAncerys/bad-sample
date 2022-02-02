import React, { useState, useRef } from "react";
import { connect } from "frontity";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import Loading from "../loading";
import PinIcon from "../../img/svg/pinIcon.svg";
import { colors } from "../../config/imports";

const MapsComponent = ({ state, actions, libraries }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: state.auth.GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  const mapCenter = {
    lat: 51.523523422233716,
    lng: -0.13923969291700383,
  };

  const MARKER_POSITION = {
    lat: 37.772,
    lng: -122.214,
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  };

  const myPlaces = [
    {
      id: "place1",
      pos: { lat: 52.523523422233716, lng: -0.13923969291700383 },
    },
    {
      id: "place1",
      pos: { lat: 51.523523422233716, lng: -0.13923969291700383 },
    },
  ];

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();

    // map coordinates will be the center of the map
    myPlaces.map((place) => {
      bounds.extend(place.pos);
      return place.id;
    });
    // bounds.extend(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (isLoaded)
    return (
      <GoogleMap
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={containerStyle}
        // zoom={10}
        // defaultCenter={mapCenter}
      >
        <Marker position={MARKER_POSITION} icon={PinIcon} />
        <Marker
          position={{
            lat: 37.672,
            lng: -122.214,
          }}
          icon={PinIcon}
          text="Hello World!"
        />
        <Marker position={mapCenter} icon={PinIcon} title="Hello" />
      </GoogleMap>
    );

  return <Loading />;
};

export default connect(MapsComponent);
