import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";

const RegistrationStepOne = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() => setGoToAction({ path: `/membership/`, actions })}
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: `0 1em` }}
          onClick={() => setGoToAction({ path: `/membership/`, actions })}
        >
          Save & Exit
        </div>
        <div
          className="blue-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-2-personal-information/`,
              actions,
            })
          }
        >
          Next
        </div>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <div className="primary-title" style={styles.title}>
            The Process
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            How it works dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ut
            tellus elementum sagittis vitae et. Justo donec enim diam vulputate
            ut pharetra sit. Purus semper eget duis at tellus at. Sed adipiscing
            diam donec adipiscing tristique risus. A cras semper auctor neque
            vitae tempus quam. Ac auctor augue
          </div>
          <div
            className="caps-btn"
            onClick={() => setGoToAction({ path: `/membership/`, actions })}
            style={{ paddingTop: `1em` }}
          >
            Memberships Page
          </div>
          <div
            className="primary-title"
            style={{
              ...styles.title,
              marginTop: `1em`,
              paddingTop: `1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            You Will Need:
          </div>
          <div style={styles.subTitle}>Personal Details:</div>
          <div>
            <ul>
              <li>CV</li>
              <li>
                Main Hospital details - please note that you cannot change this
                after application without a request to the BAD.
              </li>
              <li>GMC</li>
              <li>
                Current Post - please note that you cannot change this after
                application without a request to the BAD.
              </li>
              <li>Medical School (for student category only)</li>
              <li>Do you hold MRCP? (for student category only)</li>
              <li>
                Supporting Member Details (2 x members for all categories except
                Medical Students who require only 1)
              </li>
            </ul>
          </div>
          <div style={styles.subTitle}>Professional Details:</div>
          <div>
            <ul>
              <li>Coffee</li>
              <li>Tea</li>
              <li>Milk</li>
            </ul>
          </div>
          <div style={styles.subTitle}>Payment Details</div>
        </div>
        <ServeActions />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div style={styles.container}>
          <SideBarMenu />
          <ServeContent />
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 2fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  wrapper: {
    borderBottom: `1px solid ${colors.silverFillTwo}`,
    padding: `0 1em 0`,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontWeight: "bold",
    padding: `0.75em 0`,
  },
};

export default connect(RegistrationStepOne);
