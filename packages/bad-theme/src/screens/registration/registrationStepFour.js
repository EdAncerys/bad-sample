import { useState, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

import ProfessionalDetails from "./forms/professionalDetails";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [category, setCategory] = useState(() => {
    if (!applicationData) return "";
    const isSIG = applicationData[0].bad_organisedfor === "SIG";

    let applicationCategory = "";
    applicationData.map((data) => {
      if (data.bad_categorytype)
        applicationCategory = isSIG
          ? data._bad_sigid_value
          : data.bad_categorytype;
    });

    return applicationCategory;
  });

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    return (
      <div>
        <div style={{ padding: `0 1em 0` }}>
          <div className="primary-title" style={styles.title}>
            Professional Details
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            How it works dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ut
            tellus elementum sagittis vitae et. Justo donec enim diam vulputate
            ut pharetra sit. Purus semper eget duis at tellus at. Sed adipiscing
            diam donec adipiscing tristique risus. A cras semper auctor neque
            vitae tempus quam. Ac auctor augue
          </div>
          <div>
            <span className="required" />
            Mandatory fields
          </div>
          <div
            className="caps-btn"
            onClick={() =>
              setGoToAction({
                path: `/membership/categories-of-membership/`,
                actions,
              })
            }
            style={{ paddingTop: `1em` }}
          >
            Memberships Page
          </div>

          <div
            className="primary-title"
            style={{
              ...styles.title,
              paddingTop: `1em`,
              marginTop: `1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            Category Selected : <span>{category}</span>
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            Category requirements: GP members will be UK or Irish general
            practitioners (including GPwSIs/GPwERs) who spend less than 50% of
            their working time in dermatology.
          </div>

          <ProfessionalDetails />
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
  inputContainer: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
    padding: `2em 0`,
  },
  title: {
    fontSize: 22,
  },
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    margin: `0 10px 0 0`,
  },
};

export default connect(RegistrationStepFour);
