import { useState, useEffect } from "react";
import { connect } from "frontity";

import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import SideBarMenu from "./sideBarMenu";

import BlockWrapper from "../../components/blockWrapper";
import PersonalDetails from "./forms/personalInformation";
import { muiQuery } from "../../context";
const RegistrationStepThree = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const { lg } = muiQuery();
  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    return (
      <div>
        <div style={{ padding: `0 1em 0` }}>
          <div className="primary-title" style={styles.title}>
            Personal Information
          </div>

          <div style={{ paddingTop: `0.75em` }}>
            <span className="required" /> Mandatory fields
          </div>

          <PersonalDetails />
        </div>
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
        <div style={!lg ? styles.container : styles.containerMobile}>
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  title: {
    fontSize: 20,
  },
};

export default connect(RegistrationStepThree);
