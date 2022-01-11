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

  // SERVERS ---------------------------------------------
  const ServeProgressBar = () => {
    const ServeLine = () => {
      return (
        <div
          style={{
            borderBottom: `15px solid ${colors.primary}`,
          }}
        />
      );
    };

    const ServeProgress = ({ complete }) => {
      const ServeComplete = () => {
        const alt = "Complete";
        const WIDTH = 30;

        return (
          <div style={{ position: "relative" }}>
            <div>
              <ServeLine />
            </div>
            <div
              style={{
                width: WIDTH,
                height: WIDTH,
                position: "absolute",
                zIndex: 1,
                top: -WIDTH / 4,
                right: -3,
              }}
            >
              <Image
                src={CheckMarkGreen}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        );
      };

      const ServeInProgress = () => {
        const alt = "InProgress";
        const WIDTH = 30;

        return (
          <div style={{ position: "relative" }}>
            <ServeLine />
            <div
              style={{
                width: WIDTH,
                height: WIDTH,
                position: "absolute",
                zIndex: 1,
                top: -WIDTH / 4,
                right: -3,
              }}
            >
              <Image
                src={Ellipse}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        );
      };
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `2fr 1fr`,
            alignItems: "center",
          }}
        >
          <ServeLine />
          {complete && <ServeComplete />}
          {!complete && <ServeInProgress />}
        </div>
      );
    };

    return (
      <div>
        <div style={styles.progressBar}>
          <ServeProgress complete />
          <ServeProgress complete />
          <ServeProgress complete />
          <ServeProgress />
          <ServeProgress />
        </div>
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
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/register/step-1-the-process/`,
              actions,
            })
          }
        >
          Application
        </button>
      </div>

      <ServeProgressBar />
    </div>
  );
};

const styles = {
  progressBar: {
    display: "grid",
    gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
    justifyContent: "center",
    alignItems: "center",
    padding: `2em 0`,
  },
  progressMenuBar: {
    display: "grid",
    gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
    textAlign: "end",
    gap: 0,
    fontSize: 12,
    padding: `0 0 3em 0`,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.softBlack,
    padding: `0.5em 0`,
  },
};

export default connect(ProfileProgress);
