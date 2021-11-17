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
      <div className="flex-row">
        <div className="flex">
          <h5 className="card-title" style={{ fontSize: "1.75em" }}>
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
