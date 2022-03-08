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

  return (
    <LoadScript
      googleMapsApiKey={state.auth.GOOGLE_API_KEY}
      libraries={LIBRARIES}
    >
      <GoogleMap center={CENTER} zoom={ZOOM} mapContainerStyle={containerStyle}>
        {!markers && (
          <Marker markerLabel={{ text: "Google Map" }} position={CENTER} />
        )}
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
