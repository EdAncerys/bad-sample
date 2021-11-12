import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

const CardBlockHeader = ({ state, actions, title, urlTitle, url }) => {
  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("url", url); // debug
    actions.router.set(`${url}`);
  };

  return (
    <div>
      <div className="flex-row mt-4 mb-2">
        <div className="flex">
          <h5
            className="card-title"
            style={{ paddingLeft: 15, fontSize: "1.75em" }}
          >
            {title}
          </h5>
        </div>

        <div onClick={handleGoToPath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">{urlTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  footerActionTitle: {
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
    textTransform: "uppercase",
    fontSize: "0.75em",
    cursor: "pointer",
  },
};

export default connect(CardBlockHeader);
