import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";

import Loading from "../loading";
import SearchIcon from "@mui/icons-material/Search";

const PilGuidelines = ({ state, actions }) => {
  // SERVERS ---------------------------------------------
  const ServeSearchContainer = () => {
    return (
      <div className="d-none d-lg-block">
        <div className="input-group lg" style={{ display: "flex", flex: 1.5 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your search..."
          />
          <span className="input-group-text" id="basic-addon2">
            <SearchIcon />
          </span>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={styles.container}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">PIL & Guidelines Quicklinks</h5>
          <ServeSearchContainer />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px 5%",
    backgroundColor: colors.lightSilver,
  },
};

export default connect(PilGuidelines);
