import { useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

import { UK_HOSPITALS } from "../../config/data";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setApplicationDataAction,
} from "../../context";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, applicationType } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const isStudent =
    applicationType && applicationType.apply_for_membership === "Student";
  const isTrainee =
    applicationType && applicationType.apply_for_membership === "Trainee";
  const isAssociateTrainee =
    applicationType &&
    applicationType.apply_for_membership === "Associate Trainee";
  const isAssociate =
    applicationType && applicationType.apply_for_membership === "Associate";
  const isAssociateOverseas =
    applicationType &&
    applicationType.apply_for_membership === "Associate Overseas";
  const isGP = applicationType && applicationType.apply_for_membership === "GP";
  const isCareerGrade =
    applicationType && applicationType.apply_for_membership === "Career Grade";
  const isOrdinary =
    applicationType && applicationType.apply_for_membership === "Ordinary";
  const isOrdinarySAS =
    applicationType && applicationType.apply_for_membership === "Ordinary SAS";
  const isAlliedHealthcareProfessional =
    applicationType &&
    applicationType.apply_for_membership === "Allied Healthcare Professional";

  const gmcNumberRef = useRef(null);
  const registrationNumberRef = useRef(null);
  const ntnNumberRef = useRef(null);
  const jobTitleRef = useRef(null);
  const hospitalRef = useRef(null);
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
  const constitutionCheckRef = useRef(null);
  const privacyNoticeRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSubmit = () => {
    const gmcNumber = gmcNumberRef.current.value;
    const registrationNumber = registrationNumberRef.current.value;
    const ntnNumber = ntnNumberRef.current.value;
    const jobTitle = jobTitleRef.current.value;
    const hospital = hospitalRef.current.value;
    const medicalSchool = medicalSchoolRef.current.value;

    const smOneLastName = smOneLastNameRef.current.value;
    const smOneFirstName = smOneFirstNameRef.current.value;
    const smOneEmail = smOneEmailRef.current.value;
    const smOneConfirmEmail = smOneConfirmEmailRef.current.value;

    const smTwoLastName = smTwoLastNameRef.current.value;
    const smTwoFirstName = smTwoFirstNameRef.current.value;
    const smTwoEmail = smTwoEmailRef.current.value;
    const smTwoConfirmEmail = smTwoConfirmEmailRef.current.value;

    const mrcp = mrcpRef.current.value;
    const cv = cvRef.current.files[0];
    const constitutionCheck = constitutionCheckRef.current.checked;
    const privacyNotice = privacyNoticeRef.current.checked;

    const details = {
      gmcNumber,
      registrationNumber,
      ntnNumber,
      jobTitle,
      hospital,
      medicalSchool,
      smOneLastName,
      smOneFirstName,
      smOneEmail,
      smOneConfirmEmail,
      smTwoLastName,
      smTwoFirstName,
      smTwoEmail,
      smTwoConfirmEmail,
      mrcp,
      cv,
      constitutionCheck,
      privacyNotice,
    };

    console.log(details);
  };

  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      return (
        <div
          className="form-group"
          style={{
            display: "grid",
            gap: 10,
            marginTop: `1em`,
            padding: `1em 1em 0 1em`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          {!isStudent && (
            <div>
              <label style={styles.subTitle}>
                GMC Number <SMF />
              </label>
              <input
                ref={gmcNumberRef}
                type="text"
                className="form-control"
                placeholder="GMC Number"
                style={styles.input}
              />
            </div>
          )}
          <label style={styles.subTitle}>
            Regulatory Body Registration Number
          </label>
          <input
            ref={registrationNumberRef}
            type="text"
            className="form-control"
            placeholder="Regulatory Body Registration Number"
            style={styles.input}
          />
          <label style={styles.subTitle}>NTN Number</label>
          <input
            ref={ntnNumberRef}
            type="text"
            className="form-control"
            placeholder="NTN Number"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Current post/job title <SMF />
          </label>
          <input
            ref={jobTitleRef}
            type="text"
            className="form-control"
            placeholder="Current job title"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Main Hospital/Place of work <SMF />
          </label>
          <Form.Select ref={hospitalRef} style={styles.input}>
            <option value="null" hidden>
              Main Hospital/Place of work
            </option>
            {UK_HOSPITALS.map((item, key) => {
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </Form.Select>
          <label style={styles.subTitle}>Medical School</label>
          <input
            ref={medicalSchoolRef}
            type="text"
            className="form-control"
            placeholder="Medical School"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeSupportingMembers = () => {
      return (
        <div
          className="form-group"
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `2em 1em`,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <label style={styles.subTitle}>
              Supporting Member 1<SMF />:
            </label>
            <label style={styles.subTitle}>First Name</label>
            <input
              ref={smOneFirstNameRef}
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>Last Name</label>
            <input
              ref={smOneLastNameRef}
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>E-mail Address</label>
            <input
              ref={smOneEmailRef}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={styles.subTitle}>Confirm Their E-mail Address</label>
            <input
              ref={smOneConfirmEmailRef}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <label style={styles.subTitle}>
              Supporting Member 2<SMF />:
            </label>
            <label style={styles.subTitle}>First Name</label>
            <input
              ref={smTwoFirstNameRef}
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>Last Name</label>
            <input
              ref={smTwoLastNameRef}
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>E-mail Address</label>
            <input
              ref={smTwoEmailRef}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={styles.subTitle}>Confirm Their E-mail Address</label>
            <input
              ref={smTwoConfirmEmailRef}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
          </div>
        </div>
      );
    };

    const ServeUploads = () => {
      return (
        <div
          className="form-group"
          style={{
            display: "grid",
            gap: 20,
            padding: `2em 1em`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
            borderBottom: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          <label style={styles.subTitle}>
            MRCP
            <SMF />
          </label>
          <input
            ref={mrcpRef}
            type="text"
            className="form-control"
            placeholder="MRCP"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Upload Your CV
            <SMF />
          </label>
          <input
            ref={cvRef}
            type="file"
            className="form-control"
            placeholder="Profile Photo"
            accept="*"
            style={styles.input}
          />
        </div>
      );
    };

    return (
      <div>
        <ServePersonalDetailsInput />
        <ServeSupportingMembers />
        <ServeUploads />
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-3-category-selection/`,
              actions,
            })
          }
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: `0 1em` }}
          onClick={() => setGoToAction({ path: `/`, actions })}
        >
          Save & Exit
        </div>
        <div
          className="blue-btn"
          onClick={() => {
            handleSubmit();
            setGoToAction({
              path: `/membership/step-5-thank-you/`,
              actions,
            });
          }}
        >
          Next
        </div>
      </div>
    );
  };

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
            <label className="form-check-label">
              I have read the{" "}
              <span style={styles.TC}>
                BAD Constitution
                <SMF />
              </span>
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
            <label className="form-check-label">
              <span style={styles.TC}>
                I agree - Privacy Notice
                <SMF />
              </span>{" "}
              I agree - Privacy Notice* - justo donec enim diam vulputate ut
              pharetra sit. Purus semper eget duis at tellus at. Sed adipiscing
              diam.
            </label>
          </div>
        </div>
      </div>
    );
  };

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
            <SMF />
            Mandatory fields
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
              paddingTop: `1em`,
              marginTop: `1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            Category Selected : GP
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            Category requirements: GP members will be UK or Irish general
            practitioners (including GPwSIs/GPwERs) who spend less than 50% of
            their working time in dermatology.
          </div>

          <ServeForm />
          <ServeAgreements />
          <ServeActions />
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
  subTitle: {
    fontWeight: "bold",
  },
  input: {
    borderRadius: 10,
  },
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    margin: `0 10px 0 0`,
  },
  TC: {
    textDecoration: "underline",
    textUnderlineOffset: 5,
    cursor: "pointer",
  },
};

export default connect(RegistrationStepFour);
