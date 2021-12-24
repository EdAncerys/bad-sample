import { useState } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import BlockBuilder from "../components/builder/blockBuilder";
import { colors } from "../config/imports";
import Avatar from "../img/svg/profile.svg";
import Ellipse from "../img/svg/ellipse.svg";
import CheckMarkGreen from "../img/svg/checkMarkGreen.svg";
import { setGoToAction } from "../context";
import BlockWrapper from "../components/blockWrapper";

const Dashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleFormSave = () => {
    const firstName = document.querySelector("#fistName").value;
    const lastName = document.querySelector("#lastName").value;
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value.toLowerCase();

    const updateCredentials = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log("updateCredentials", updateCredentials);
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `1em 0 0`,
          }}
        >
          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>Your First Name</label>
            <input
              id="fistName"
              type="text"
              className="form-control"
              placeholder="Your First Name"
              style={styles.input}
            />
            <label>Your Last Name</label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="Your Last Name"
              style={styles.input}
            />
          </div>

          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>Your Contact E-mail Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Your Contact E-mail Address"
              style={styles.input}
            />
            <label>Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              style={styles.input}
            />
          </div>
        </div>
      );
    };

    return (
      <div>
        <ServePersonalDetailsInput />
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <button
          type="submit"
          className="btn btn-outline-secondary"
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/`,
              actions,
            })
          }
        >
          Back
        </button>
        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            marginLeft: `1em`,
          }}
          onClick={() => {
            handleFormSave();
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/`,
              actions,
            });
          }}
        >
          Save
        </button>
      </div>
    );
  };

  const ServeProfileContent = () => {
    const ServeProfileAvatar = () => {
      const alt = "Profile Avatar";

      return (
        <div className="flex" style={{ justifyContent: "flex-end" }}>
          <div style={{ width: 190, height: 190 }}>
            <Image
              src={Avatar}
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
      <div className="shadow" style={styles.profileContainer}>
        <div>
          <div className="primary-title" style={styles.title}>
            Hello Dr. Katie Lewis
          </div>

          <div style={{ paddingTop: `0.75em` }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>

        <ServeProfileAvatar />
      </div>
    );
  };

  const ServeProfileProgress = () => {
    const ServeProgressBar = () => {
      const ServeProgress = ({ complete }) => {
        const ServeLine = () => {
          return (
            <div
              style={{
                borderBottom: `15px solid ${colors.primary}`,
              }}
            />
          );
        };

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
      <div className="flex-col shadow" style={{ padding: `2em 4em` }}>
        <div className="flex">
          <div className="flex primary-title" style={styles.subTitle}>
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

  const ServePersonalDetails = () => {
    return (
      <div
        className="shadow"
        style={{ padding: `2em 4em`, margin: `2em 0 0 0` }}
      >
        <div>
          <div className="primary-title" style={styles.subTitle}>
            Personal Details:
          </div>
          <ServeForm />
          <ServeActions />
        </div>
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div style={{ backgroundColor: colors.white }}>
        <div
          style={{
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <div className="flex-col" style={{ justifyContent: "center" }}>
            <ServeProfileContent />
            <ServeProfileProgress />
            <ServePersonalDetails />
          </div>
        </div>
      </div>
      <BlockBuilder blocks={wpBlocks} />
    </BlockWrapper>
  );
};

const styles = {
  profileContainer: {
    display: "grid",
    gridTemplateColumns: `2fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
    padding: `2em 4em`,
    margin: `0 0 2em 0`,
  },
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
    color: colors.black,
    padding: `0.5em 0`,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  input: {
    borderRadius: 10,
    color: colors.darkSilver,
  },
};

export default connect(Dashboard);
