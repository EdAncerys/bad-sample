import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";

import Ellipse from "../../img/svg/ellipse.svg";
import CheckMarkGreen from "../../img/svg/checkMarkGreen.svg";

// CONTEXT ----------------------------------------------------------------
import { setGoToAction } from "../../context";

const ProfileProgress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 30;

  // SERVERS ---------------------------------------------
  const ServeProgressBar = () => {
    const ServeProgressIcon = ({ complete }) => {
      const alt = complete ? "complete" : "in-progress";

      return (
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
          }}
        >
          <Image
            src={complete ? CheckMarkGreen : Ellipse}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      );
    };

    const ServeLine = () => {
      return (
        <div
          className="flex"
          style={{
            position: "relative",
            borderBottom: `15px solid ${colors.primary}`,
            margin: `2em 0`,
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
              width: "100%",
              left: 0,
              top: -ICON_WIDTH / 3,
              justifyItems: "flex-end",
            }}
          >
            <ServeProgressIcon complete />
            <ServeProgressIcon complete />
            <ServeProgressIcon complete />
            <ServeProgressIcon />
            <ServeProgressIcon />
          </div>
        </div>
      );
    };

    return (
      <div>
        <ServeLine />

        <div className="flex" style={styles.progressMenuBar}>
          <div>Step 1 - The Process</div>
          <div>Step 2 - Personal Information</div>
          <div>Step 3 - Category Selection</div>
          <div>Step 4 - Professional Details</div>
          <div>Review</div>
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        type="submit"
        className="blue-btn"
        // onClick={() =>
        //   setGoToAction({
        //     path: `https://badadmin.skylarkdev.co/membership/register/step-1-the-process/`,
        //     actions,
        //   })
        // }
      >
        Application
      </div>
    );
  };

  return (
    <div
      className="flex-col shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="flex">
        <div
          className="flex primary-title"
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Application Progress - Step 3 - Category Selection
        </div>
        <ServeActions />
      </div>

      <ServeProgressBar />
    </div>
  );
};

const styles = {
  progressMenuBar: {
    display: "grid",
    gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
    textAlign: "end",
    fontSize: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.softBlack,
    padding: `0.5em 0`,
  },
};

export default connect(ProfileProgress);
