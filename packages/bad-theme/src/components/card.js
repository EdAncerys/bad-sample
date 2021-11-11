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
      <div>
        <div className="flex">
          <div
            style={{
              backgroundColor: colors.lightSilver,
              padding: `2px 5px`,
              borderRadius: 5,
              textTransform: "uppercase",
            }}
          >
            {cardTitle}
          </div>
        </div>
      </div>
    );
  };

  const ServeFooterActions = () => {
    return (
      <div>
        <div className="flex-row" style={{ justifyContent: "space-between" }}>
          <div onClick={handleGoToPath}>
            <div style={styles.footerActionTitle}>
              <p className="card-text">Read More</p>
            </div>
          </div>

          <div onClick={handleGoToPath}>
            <div style={styles.footerActionTitle}>
              <p className="card-text">Read More</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    return (
      <div className="flex-col mt-4">
        <div>
          <h5 className="card-text fw-100" style={{ color: colors.black }}>
            {title}
          </h5>
        </div>
        <div className="flex mt-2">
          <p className="card-text">{body}</p>
        </div>
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div className="card m-2" style={styles.card}>
      <div className="card-body flex-col">
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
    minWidth: "30%",
    minHeight: 200,
  },
  footerActionTitle: {
    borderBottom: `1px solid ${colors.black}`,
  },
};

export default connect(RowButton);
