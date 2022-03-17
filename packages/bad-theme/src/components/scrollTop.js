import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ScrollTop = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // HANDLERS --------------------------------------------
  const handleGoToTop = () => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
  };

  return (
    <div
      style={{
        padding: "2em 0",
        borderBottom: `1px solid ${colors.lightSilver}`,
      }}
      onClick={handleGoToTop}
    >
      <div className="caps-btn">
        <ArrowUpwardIcon className="caps-btn-icon" />
        <span>Return Back To Top</span>
        <ArrowUpwardIcon className="caps-btn-icon" />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ScrollTop);
