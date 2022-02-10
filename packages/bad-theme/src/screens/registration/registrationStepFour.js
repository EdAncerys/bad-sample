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

import { UK_HOSPITALS } from "../../config/data";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  getHospitalsAction,
} from "../../context";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, idReplacement } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const inputRef = useRef(null);

  const gmcNumberRef = useRef(null);
  const registrationNumberRef = useRef(null);
  const ntnNumberRef = useRef(null);
  const jobTitleRef = useRef("");
  const hospitalRef = useRef("");
  const medicalSchoolRef = useRef(null);

  const smOneFirstNameRef = useRef(null);
  const smOneLastNameRef = useRef(null);
  const smOneEmailRef = useRef(null);
  const smOneConfirmEmailRef = useRef(null);

  const smTwoFirstNameRef = useRef(null);
  const smTwoLastNameRef = useRef(null);
  const smTwoEmailRef = useRef(null);
  const smTwoConfirmEmailRef = useRef(null);

  const mrcpRef = useRef(null);
  const cvRef = useRef(null);
  const gradeRef = useRef(null);
  const constitutionCheckRef = useRef(null);
  const privacyNoticeRef = useRef(null);

  const [hospitals, setHospitals] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    hospitalSearch: "",
  });

  // HANDLERS --------------------------------------------
  const handleInputChange = (e) => {
    console.log(formData);

    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    console.log(name, value);
  };

  const handleHospitalLookup = async () => {
    console.log("API call");
    if (hospitalRef.current.value.length < 2) return; // API call after 2 characters

    const hospitalData = await getHospitalsAction({
      state,
      input: hospitalRef.current.value,
    });

    console.log("Hospitals", hospitalData);
    setHospitals(hospitalData);
  };

  // SERVERS ---------------------------------------------
  const ServeAgreements = () => {
    return (
      <div
        className="flex-col form-check"
        style={{
          padding: `1em 0`,
          borderBottom: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <div
          className="flex"
          style={{ alignItems: "center", padding: `1em 0` }}
        >
          <div>
            <input
              ref={constitutionCheckRef}
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label flex-row">
              <div>I agree to the </div>
              <div
                className="caps-btn required"
                style={{ paddingTop: 6, marginLeft: 10 }}
              >
                BAD Constitution
              </div>
            </label>
          </div>
        </div>

        <div
          className="flex"
          style={{ alignItems: "center", padding: `1em 0` }}
        >
          <div>
            <input
              ref={privacyNoticeRef}
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label flex-row">
              <div>
                <div
                  className="caps-btn required"
                  style={{
                    paddingTop: 6,
                    marginRight: 10,
                    whiteSpace: "nowrap",
                    float: "left",
                  }}
                >
                  I agree - Privacy Notice
                </div>
                <span>
                  I agree - Privacy Notice* - justo donec enim diam vulputate ut
                  pharetra sit. Purus semper eget duis at tellus at. Sed
                  adipiscing diam.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const ServeContent = () => {
    const category = applicationData
      ? applicationData.apply_for_membership
      : "";

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
            Category Selected : {category}
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
