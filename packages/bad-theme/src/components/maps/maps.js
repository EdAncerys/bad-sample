import { useState, useCallback, useRef } from "react";
import { connect } from "frontity";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

import Loading from "../loading";
import PinIcon from "../../img/svg/pinIcon.svg";
import { colors } from "../../config/imports";

const LIBRARIES = ["places"];

const MapsComponent = ({
  state,
  actions,
  libraries,
  zoom,
  center,
  markers,
}) => {
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: state.auth.GOOGLE_API_KEY,
  // });

  const CENTER = center || { lat: 51.5072, lng: -0.1276 };
  const ZOOM = zoom || 10;

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: markers ? 0 : 10,
  };
  const ServeMarkersOnTheMap = () => {
    console.log("MARKERO", markers);
    if (!markers)
      return <Marker markerLabel={{ text: "Google Map" }} position={CENTER} />;
    if (markers.length === 0) return null;

    return markers.map((derm, key) => {
      if (!derm.distance) return null;
      const POSITION = {
        lat: Number(derm.cordinates.lat),
        lng: Number(derm.cordinates.lng),
      };
      const marker_key = key + 1;
      const marker_label = marker_key.toString();
      return (
        <Marker
          markerLabel={{ text: "Johny" }}
          position={POSITION}
          label={{ text: marker_label, color: "white" }}
          title="Pedalka"
          options={{
            fillColor: "lightblue",
          }}
        />
      );
    });
  };
  return (
    <LoadScript
      googleMapsApiKey={state.auth.GOOGLE_API_KEY}
      libraries={LIBRARIES}
    >
      <GoogleMap center={CENTER} zoom={ZOOM} mapContainerStyle={containerStyle}>
        <ServeMarkersOnTheMap />
      </GoogleMap>
    </LoadScript>
  );

  // if (isLoaded)
  //   return (
  //     // <GoogleMap
  //     //   onLoad={loadHandler}
  //     //   onUnmount={onUnmount}
  //     //   mapContainerStyle={containerStyle}
  //     //   // zoom={10}
  //     //   // defaultCenter={mapCenter}
  //     // >
  //     //   <Marker position={MARKER_POSITION} icon={PinIcon} />
  //     //   <Marker
  //     //     position={{
  //     //       lat: 37.672,
  //     //       lng: -122.214,
  //     //     }}
  //     //     icon={PinIcon}
  //     //     text="Hello World!"
  //     //   />
  //     //   <Marker position={mapCenter} icon={PinIcon} title="Hello" />
  //     // </GoogleMap>
  //   );
  // return <Loading />;
};

export default connect(MapsComponent);
