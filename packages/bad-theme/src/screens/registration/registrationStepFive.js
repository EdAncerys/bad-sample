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
  const { applicationData, applicationType } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const isStudent =
    applicationType && applicationType.apply_for_membership === "Student";
  const isTrainee =
    applicationType && applicationType.apply_for_membership === "Trainee";
  const isAssociateOverseas =
    applicationType &&
    applicationType.apply_for_membership === "Associate Overseas";
  const isAlliedHealthcareProfessional =
    applicationType &&
    applicationType.apply_for_membership === "Allied Healthcare Professional";
  const isBritishCosmeticDermatologyGroup =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Cosmetic Dermatology Group";
  const isBritishHairNailsSociety =
    applicationType &&
    applicationType.apply_for_membership === "British Hair and Nails Society";
  const isBritishSocietyOverseas =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society of Cutaneous Allergy Overseas";
  const isBritishSocietyDermatopathology =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Dermatopathology";
  const isBritishSurgeryInternational =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Dermatological Surgery International";
  const isBritishSocietyGeriatricDermatology =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Geriatric Dermatology";
  const isBritishSocietyMedicalDermatology =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Medical Dermatology";
  const isBritishSocietyMedicalDermatologyAssociate =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Medical Dermatology Associate";
  const isBritishSocietySkinCare =
    applicationType &&
    applicationType.apply_for_membership ===
      "British Society for Skin Care in Immunocompromised Individuals";
  const isDERMPATHPRO =
    applicationType && applicationType.apply_for_membership === "DERMPATHPRO";

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
  const gradeRef = useRef(null);
  const constitutionCheckRef = useRef(null);
  const privacyNoticeRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSubmit = () => {
    const gmcNumber = gmcNumberRef.current ? gmcNumberRef.current.value : null;
    const registrationNumber = registrationNumberRef.current
      ? registrationNumberRef.current.value
      : null;
    const ntnNumber = ntnNumberRef.current ? ntnNumberRef.current.value : null;
    const jobTitle = jobTitleRef.current ? jobTitleRef.current.value : null;
    const hospital = hospitalRef.current ? hospitalRef.current.value : null;
    const medicalSchool = medicalSchoolRef.current
      ? medicalSchoolRef.current.value
      : null;

    const smOneLastName = smOneLastNameRef.current
      ? smOneLastNameRef.current.value
      : null;
    const smOneFirstName = smOneFirstNameRef.current
      ? smOneFirstNameRef.current.value
      : null;
    const smOneEmail = smOneEmailRef.current
      ? smOneEmailRef.current.value
      : null;
    const smOneConfirmEmail = smOneConfirmEmailRef.current
      ? smOneConfirmEmailRef.current.value
      : null;

    const smTwoLastName = smTwoLastNameRef.current
      ? smTwoLastNameRef.current.value
      : null;
    const smTwoFirstName = smTwoFirstNameRef.current
      ? smTwoFirstNameRef.current.value
      : null;
    const smTwoEmail = smTwoEmailRef.current
      ? smTwoEmailRef.current.value
      : null;
    const smTwoConfirmEmail = smTwoConfirmEmailRef.current
      ? smTwoConfirmEmailRef.current.value
      : null;

    const mrcp = mrcpRef.current ? mrcpRef.current.value : null;
    const cv = cvRef.current ? cvRef.current.files[0] : null;
    const grade = gradeRef.current ? gradeRef.current.value : null;
    const constitutionCheck = constitutionCheckRef.current
      ? constitutionCheckRef.current.checked
      : null;
    const privacyNotice = privacyNoticeRef.current
      ? privacyNoticeRef.current.checked
      : null;

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
      grade,
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
    const ServeQualification = () => {
      if (applicationType && isStudent) return null;

      return (
        <div>
          <label style={styles.subTitle}>
            Qualification <SMF />
          </label>
          <input
            ref={gmcNumberRef}
            type="text"
            className="form-control"
            placeholder="Qualification"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeLicense = () => {
      if (
        (applicationType && isAssociateOverseas) ||
        (applicationType && isAlliedHealthcareProfessional)
      )
        return null;

      return (
        <div className="flex-col">
          <label style={styles.subTitle}>
            License to practice medicine (Y/N)
          </label>
          <input
            ref={constitutionCheckRef}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />
        </div>
      );
    };

    const ServeBADMember = () => {
      if (applicationType && isTrainee) return null;

      return (
        <div className="flex-col">
          <label style={styles.subTitle}>Are you BAD member (Y/N)</label>
          <input
            ref={constitutionCheckRef}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />
        </div>
      );
    };

    const ServeLocation = () => {
      if (applicationType && isStudent) return null;

      return (
        <div>
          <label style={styles.subTitle}>I identify myself as</label>
          <Form.Select ref={hospitalRef} style={styles.input}>
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
      if (applicationType && isStudent) return null;

      return (
        <div>
          <label style={styles.subTitle}>Specialist Interest</label>
          <Form.Select ref={hospitalRef} style={styles.input}>
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
      if (applicationType && isDERMPATHPRO) return null;

      const sigName = applicationType
        ? applicationType.apply_for_membership
        : "SIG";

      return (
        <div>
          <label style={styles.subTitle}>
            Describe your interest in {sigName}
          </label>
          <input
            ref={jobTitleRef}
            type="text"
            className="form-control"
            placeholder={`Describe your interest in ${sigName}`}
            style={styles.input}
          />
        </div>
      );
    };

    const ServeSpecialties = () => {
      if (applicationType && isDERMPATHPRO) return null;

      return (
        <div>
          <label style={styles.subTitle}>
            Do you do joint clinics with any other specialties?
          </label>
          <input
            ref={jobTitleRef}
            type="text"
            className="form-control"
            placeholder="Do you do joint clinics with any other specialties?"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeAreaInterest = () => {
      if (applicationType && isStudent) return null;

      return (
        <div>
          <label style={styles.subTitle}>Main area of interest </label>
          <Form.Select ref={hospitalRef} style={styles.input}>
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
      if (applicationType && isTrainee) return null;

      const [include, setInclude] = useState(null);

      return (
        <div className="flex-col">
          <label style={styles.subTitle}>
            Do you want to be part of the BSSCII discussion form?
          </label>
          <input
            ref={constitutionCheckRef}
            onChange={() => setInclude(!include)}
            type="checkbox"
            className="form-check-input"
            style={styles.checkBox}
          />

          {include && (
            <div>
              <label style={styles.subTitle}>Email Address</label>
              <input
                ref={jobTitleRef}
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
    const category = applicationType
      ? applicationType.apply_for_membership
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
