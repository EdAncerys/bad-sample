import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, cardTitle, title, body, url }) => {
  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ----------------------------------------------------------------
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

  const ServeCardHeader = () => {
    return (
      <div
        style={{
          backgroundColor: colors.lightSilver,
          padding: `2px 5px`,
          borderRadius: 5,
        }}
      >
        {cardTitle}
      </div>
    );
  };

  const ServeFooterActions = () => {
    return (
      <div>
        <div
          className="flex-row pointer"
          style={{ borderBottom: `1px solid ${colors.black}` }}
          onClick={handleGoToPath}
        >
          <span>
            <p className="card-text">Read More</p>
          </span>
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    return (
      <div className="flex-col pink" style={{ paddingTop: 10, flex: 1 }}>
        <h5 className="card-text fw-100" style={{ color: colors.black }}>
          {title}
        </h5>
        <p className="card-text">{body}</p>
      </div>
    );
  };

  return (
    <div className="card" style={styles.card}>
      <div className="card-body flex-col" style={{ alignItems: "start" }}>
        <ServeCardHeader />
        <ServeCardBody />
        <ServeFooterActions />
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    margin: `0 10px`,
    minWidth: "30%",
    minHeight: 200,
  },
};

export default connect(RowButton);
