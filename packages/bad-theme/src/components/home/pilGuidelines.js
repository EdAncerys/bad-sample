import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";

import Loading from "../loading";
import SearchIcon from "@mui/icons-material/Search";

const PilGuidelines = ({ state, actions }) => {
  const BANNER_HEIGHT = state.theme.bannerHeight * 1.25;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: colors.primary,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div className="d-none d-lg-block">
        <div
          style={{ display: "flex", padding: `0.75em 0`, position: "relative" }}
        >
          <input
            id="searchInput"
            type="text"
            className="form-control"
            placeholder="Enter your search..."
            style={styles.input}
          />
          <span
            className="input-group-text"
            style={{ position: "absolute", right: 0, cursor: "pointer" }}
          >
            <SearchIcon />
          </span>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        ...styles.container,
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div
        className="flex"
        style={{
          height: BANNER_HEIGHT / 3,
          backgroundColor: colors.white,
          alignItems: "center",
        }}
      >
        <div className="flex-col" style={{ padding: `1em 2em` }}>
          <div
            style={{ fontSize: 36, fontWeight: "bold", color: colors.black }}
          >
            PIL & Guidelines Quicklinks
          </div>
          <ServeSearchContainer />
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
  },
  input: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingRight: 60,
    color: colors.darkSilver,
  },
};

export default connect(PilGuidelines);
