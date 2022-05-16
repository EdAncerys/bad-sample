import { connect } from "frontity";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

import { useAppDispatch } from "../../context";
const LIBRARIES = ["places"];

const MapsComponent = ({
  state,
  actions,
  libraries,
  zoom,
  center,
  markers,
  queryType,
}) => {
  const dispatch = useAppDispatch();

  const CENTER = center || { lat: 51.5072, lng: -0.1276 };
  const ZOOM = zoom || 10;

  const containerStyle = {
    width: "100%",
    height: "100%",
    // borderRadius: markers ? 0 : 10,
    borderRadius: 0
  };

  const ServeMarkersOnTheMap = () => {
    if (!markers)
      return <Marker markerLabel={{ text: "Google Map" }} position={CENTER} />;
    if (markers.length === 0) return null;
    let marker_key = 1;
    return markers.map((derm, key) => {
      if (
        queryType === "name" ||
        (key > 0 &&
          derm.address3_postalcode !== markers[key - 1].address3_postalcode)
      ) {
        marker_key += 1;
      }
      if (queryType === "pc" && !derm.distance) return null;
      const POSITION = queryType === "pc" && {
        lat: Number(derm.cordinates.lat),
        lng: Number(derm.cordinates.lng),
      };

      const marker_label = marker_key.toString();
      return (
        <Marker
          markerLabel={{ text: "Johny" }}
          position={POSITION}
          label={{ text: marker_label, color: "white", border: "black" }}
          title={"Pedalka"}
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
};

export default connect(MapsComponent);
