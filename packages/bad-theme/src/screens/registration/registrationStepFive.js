import { useState, useRef } from "react";
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

const RegistrationStepFive = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const isBritishHairNailsSociety =
    applicationData &&
    applicationData.apply_for_membership === "British Hair and Nails Society";
  const isBritishSocietyDermatopathology =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Dermatopathology";
  const isBritishSocietyMedicalDermatologyAssociate =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Medical Dermatology Associate";
  const isBritishSocietySkinCare =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Skin Care in Immunocompromised Individuals";

  const qualificationRef = useRef(null);
  const licenseRef = useRef(null);
  const mrcpRef = useRef(null);
  const badMemberRef = useRef(null);

  const myLocationRef = useRef(null);
  const interestRef = useRef(null);
  const descriptionRef = useRef(null);
  const specialtiesRef = useRef(null);

  const areaInterestRef = useRef(null);
  const bssciiRef = useRef(null);
  const emailRef = useRef(null);

  const constitutionCheckRef = useRef(null);
  const privacyNoticeRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSubmit = () => {
    const qualification = qualificationRef.current
      ? qualificationRef.current.value
      : null;
    const license = licenseRef.current ? licenseRef.current.value : null;
    const mrcp = mrcpRef.current ? mrcpRef.current.value : null;
    const badMember = badMemberRef.current ? badMemberRef.current.value : null;

    const myLocation = myLocationRef.current
      ? myLocationRef.current.value
      : null;
    const interest = interestRef.current ? interestRef.current.value : null;
    const description = descriptionRef.current
      ? descriptionRef.current.value
      : null;
    const specialties = specialtiesRef.current
      ? specialtiesRef.current.value
      : null;

    const areaInterest = areaInterestRef.current
      ? areaInterestRef.current.value
      : null;
    const bsscii = bssciiRef.current ? bssciiRef.current.value : null;
    const email = emailRef.current ? emailRef.current.files[0] : null;

    const constitutionCheck = constitutionCheckRef.current
      ? constitutionCheckRef.current.value
      : null;
    const privacyNotice = privacyNoticeRef.current
      ? privacyNoticeRef.current.value
      : null;

    const data = {
      qualification,
      license,
      mrcp,
      badMember,
      myLocation,
      interest,
      description,
      specialties,
      areaInterest,
      bsscii,
      email,
      constitutionCheck,
      privacyNotice,
    };

    console.log(data);
  };

  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    const ServeQualification = () => {
      return (
        <div>
          <label style={styles.subTitle}>
            Qualification <SMF />
          </label>
          <input
            ref={qualificationRef}
            type="text"
            className="form-control"
            placeholder="Qualification"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeLicense = () => {
      if (applicationData && !isBritishHairNailsSociety) return null;

      return (
        <div className="flex-col">
          <label style={styles.subTitle}>
            License to practice medicine (Y/N)
          </label>
          <input
            ref={licenseRef}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />
        </div>
      );
    };

    const ServeMRCP = () => {
      return (
        <div>
          <label style={styles.subTitle}>
            MRCP membership <SMF />
          </label>
          <input
            ref={mrcpRef}
            type="text"
            className="form-control"
            placeholder="MRCP membership"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeBADMember = () => {
      return (
        <div className="flex-col">
          <label style={styles.subTitle}>Are you BAD member (Y/N)</label>
          <input
            ref={badMemberRef}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />
        </div>
      );
    };

    const ServeLocation = () => {
      if (applicationData && !isBritishHairNailsSociety) return null;

      return (
        <div>
          <label style={styles.subTitle}>I identify myself as</label>
          <Form.Select ref={myLocationRef} style={styles.input}>
            <option value="null" hidden>
              Are you
            </option>
            <option value="UK based Trainee">UK based Trainee</option>
            <option value="UK based SAS Doctor">UK based SAS Doctor</option>
            <option value="UK based Consultant">UK based Consultant</option>
            <option value="Working outside the UK">
              Working outside the UK
            </option>
          </Form.Select>
        </div>
      );
    };

    const ServeInterest = () => {
      if (applicationData && !isBritishHairNailsSociety) return null;

      return (
        <div>
          <label style={styles.subTitle}>Specialist Interest</label>
          <Form.Select ref={interestRef} style={styles.input}>
            <option value="null" hidden>
              Specialist Interest
            </option>
            <option value="Hair">Hair</option>
            <option value="Nails">Nails</option>
            <option value="UK based Consultant">UK based Consultant</option>
            <option value="Both">Both</option>
          </Form.Select>
        </div>
      );
    };

    const ServeInterestDescription = () => {
      if (applicationData && isBritishSocietySkinCare) return null;

      const sigName = applicationData
        ? applicationData.apply_for_membership
        : "SIG";

      return (
        <div>
          <label style={styles.subTitle}>
            Describe your interest in {sigName}
          </label>
          <input
            ref={descriptionRef}
            type="text"
            className="form-control"
            placeholder={`Describe your interest in ${sigName}`}
            style={styles.input}
          />
        </div>
      );
    };

    const ServeSpecialties = () => {
      if (
        (applicationData && !isBritishSocietyDermatopathology) ||
        (applicationData && !isBritishSocietyMedicalDermatologyAssociate)
      )
        return null;

      return (
        <div>
          <label style={styles.subTitle}>
            Do you do joint clinics with any other specialties?
          </label>
          <input
            ref={specialtiesRef}
            type="text"
            className="form-control"
            placeholder="Do you do joint clinics with any other specialties?"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeAreaInterest = () => {
      if (applicationData && !isBritishSocietySkinCare) return null;

      return (
        <div>
          <label style={styles.subTitle}>Main area of interest </label>
          <Form.Select ref={areaInterestRef} style={styles.input}>
            <option value="null" hidden>
              Main area of interest
            </option>
            <option value="HIV">HIV</option>
            <option value="biologics">biologics</option>
            <option value="Solid organ transplatation">
              Solid organ transplatation
            </option>
            <option value="Haemtone oncology">Haemtone oncology</option>
            <option value="Both">Both</option>
            <option value="Other immunosuppresed groups">
              Other immunosuppresed groups
            </option>
          </Form.Select>
        </div>
      );
    };

    const ServeBSSCII = () => {
      if (applicationData && !isBritishSocietySkinCare) return null;

      const [include, setInclude] = useState(null);

      return (
        <div className="flex-col">
          <label style={styles.subTitle}>
            Do you want to be part of the BSSCII discussion form?
          </label>
          <input
            ref={bssciiRef}
            onChange={() => setInclude(!include)}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />

          {include && (
            <div>
              <label style={styles.subTitle}>Email Address</label>
              <input
                ref={emailRef}
                type="text"
                className="form-control"
                placeholder="Email Address"
                style={styles.input}
              />
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        className="form-group"
        style={{
          display: "grid",
          gap: 20,
          marginTop: `1em`,
          padding: `1em 1em 0 1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <ServeQualification />
        <ServeLicense />
        <ServeMRCP />
        <ServeBADMember />
        <ServeInterestDescription />
        <ServeLocation />
        <ServeInterest />
        <ServeSpecialties />
        <ServeAreaInterest />
        <ServeBSSCII />
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
              path: `/membership/step-4-professional-details/`,
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
            let slug = `/membership/final-step-thank-you/`;

            handleSubmit();
            setGoToAction({
              path: slug,
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
          padding: `1em 1em`,
          marginTop: `1em`,
          borderBottom: `1px solid ${colors.silverFillTwo}`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
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
                className="caps-btn"
                style={{ paddingTop: 6, marginLeft: 10 }}
              >
                BAD Constitution
                <SMF />
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
                  className="caps-btn"
                  style={{
                    paddingTop: 6,
                    marginRight: 10,
                    whiteSpace: "nowrap",
                    float: "left",
                  }}
                >
                  I agree - Privacy Notice
                  <SMF />
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
      <div style={{ padding: `0 1em 1em` }}>
        <div className="primary-title" style={styles.title}>
          SIG Questions
        </div>
        <div style={{ paddingTop: `0.75em` }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
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
          Category Selected : {category}
        </div>
        <div style={{ paddingTop: `0.75em` }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </div>

        <ServeForm />
        <ServeAgreements />
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
};

export default connect(RegistrationStepFive);
