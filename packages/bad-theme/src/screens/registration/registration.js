import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import SearchFilter from "../../components/searchFilter";
import PilGuidelines from "../../components/home/pilGuidelines";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const Registration = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  return (
    <div>
      <div>
        <p style={styles.title}>REGISTRATION</p>
      </div>

      <SearchFilter />
      <div>
        <GooglePlacesAutocomplete apiKey="AIzaSyB1HY1FKYgS-Tdiq0uG0J6T-c3_CPed5mo" />
      </div>
      <PilGuidelines />
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(Registration);
