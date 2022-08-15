import { useState, useEffect } from "react";
import { connect } from "frontity";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import Loading from "../loading";
// --------------------------------------------------------------------------------
import { useScript } from "../../context";

const MapsComponent = ({
  state,
  actions,
  libraries,
  zoom,
  center,
  markers,
  queryType,
}) => {
  const mapCenter = center || { lat: 51.5072, lng: -0.1276 };
  const ZOOM = zoom || 10;

  // console.log("🐞 markers", markers); // debug
  // console.log("🐞 mapCenter", mapCenter); // debug

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  };
  const [ready, setReady] = useState(false);

  // 📌 google places api script
  useScript({
    url: `https://maps.googleapis.com/maps/api/js?key=${state.auth.GOOGLE_API_KEY}&libraries=places`,
  });

  useEffect(async () => {
    // check if google script exist and is loaded

    // 📌 allow google maps script to be injected into the DOM
    await new Promise((resolve) => setTimeout(resolve, 500));
    setReady(true);
  }, []);

  const ServeMarkersOnTheMap = () => {
    if (!markers)
      return (
        <Marker markerLabel={{ text: "Google Map" }} position={mapCenter} />
      );
    if (markers && markers.length === 0) return null;

    let marker_key = 1;
    return markers.map((derm, key) => {
      if (
        queryType === "name" ||
        (key > 0 &&
          derm.address3_postalcode !== markers[key - 1].address3_postalcode)
      ) {
        marker_key += 1;
      }

      // --------------------------------------------------------------------------------
      // 📌  Dont shof markers if cordinates are not available
      // --------------------------------------------------------------------------------
      if ((queryType === "pc" && !derm.distance) || !derm.cordinates)
        return null;

      const mapMarker = queryType === "pc" && {
        lat: Number(derm.cordinates.lat),
        lng: Number(derm.cordinates.lng),
      };

      const marker_label = marker_key.toString();

      return (
        <Marker
          key={key}
          markerLabel={{ text: "Johny" }}
          position={mapMarker}
          label={{ text: marker_label, color: "white", border: "black" }}
          // title={"BAD"}
          options={{
            fillColor: "lightblue",
          }}
        />
      );
    });
  };

  if (!ready) return <Loading />;

  return (
    <GoogleMap
      center={mapCenter}
      zoom={ZOOM}
      mapContainerStyle={containerStyle}
    >
      <ServeMarkersOnTheMap />
    </GoogleMap>
  );
};

export default connect(MapsComponent);
