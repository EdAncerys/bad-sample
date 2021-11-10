import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";

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
            @
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">PIL & Guidelines Quicklinks</h5>
          <ServeSearchContainer />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px 20px",
    backgroundColor: colors.silver,
  },
};

export default connect(PilGuidelines);
