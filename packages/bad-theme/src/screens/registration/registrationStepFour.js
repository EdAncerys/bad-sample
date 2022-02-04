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
  setUserStoreAction,
  setLoginModalAction,
} from "../../context";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const isStudent =
    applicationData && applicationData.apply_for_membership === "Student";
  const isTrainee =
    applicationData && applicationData.apply_for_membership === "Trainee";
  const isAssociateOverseas =
    applicationData &&
    applicationData.apply_for_membership === "Associate Overseas";
  const isAlliedHealthcareProfessional =
    applicationData &&
    applicationData.apply_for_membership === "Allied Healthcare Professional";
  const isBritishCosmeticDermatologyGroup =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Cosmetic Dermatology Group";
  const isBritishHairNailsSociety =
    applicationData &&
    applicationData.apply_for_membership === "British Hair and Nails Society";
  const isBritishSocietyOverseas =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society of Cutaneous Allergy Overseas";
  const isBritishSocietyDermatopathology =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Dermatopathology";
  const isBritishSurgeryInternational =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Dermatological Surgery International";
  const isBritishSocietyGeriatricDermatology =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Geriatric Dermatology";
  const isBritishSocietyMedicalDermatology =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Medical Dermatology";
  const isBritishSocietyMedicalDermatologyAssociate =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Medical Dermatology Associate";
  const isBritishSocietySkinCare =
    applicationData &&
    applicationData.apply_for_membership ===
      "British Society for Skin Care in Immunocompromised Individuals";
  const isDERMPATHPRO =
    applicationData && applicationData.apply_for_membership === "DERMPATHPRO";

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
  const handleSaveExit = async () => {
    if (!isActiveUser) {
      setLoginModalAction({ dispatch, loginModalAction: true });
      return;
    }

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
    });

    setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    if (!isActiveUser) {
      setLoginModalAction({ dispatch, loginModalAction: true });
      return;
    }

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

    const data = {
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
      stepFour: true,
    };

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data,
    });

    let slug = `/membership/final-step-thank-you/`;
    if (applicationData && applicationData.type === "SIG Membership")
      slug = `/membership/step-5-sig-questions/`;
    setGoToAction({ path: slug, actions });
  };

  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      if (isDERMPATHPRO) return null;

      const ServeGMCNumber = () => {
        if (
          (applicationData && isStudent) ||
          (applicationData && isAssociateOverseas) ||
          (applicationData && isBritishSocietyOverseas) ||
          (applicationData && isBritishSurgeryInternational)
        )
          return null;

        return (
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
        );
      };

      const ServeRegistrationNumber = () => {
        if (
          (applicationData && isAssociateOverseas) ||
          (applicationData && isAlliedHealthcareProfessional) ||
          (applicationData && isStudent)
        )
          return null;

        return (
          <div>
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
          </div>
        );
      };

      const ServeNTNNumber = () => {
        if (applicationData && isStudent) return null;

        return (
          <div>
            <label style={styles.subTitle}>NTN Number</label>
            <input
              ref={ntnNumberRef}
              type="text"
              className="form-control"
              placeholder="NTN Number"
              style={styles.input}
            />
          </div>
        );
      };

      const ServeMainHospital = () => {
        if (applicationData && isStudent) return null;

        return (
          <div>
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
          </div>
        );
      };

      const ServeMedicalSchool = () => {
        if (applicationData && isStudent) return null;

        return (
          <div>
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

      const ServeJob = () => {
        if (applicationData && isDERMPATHPRO) return null;

        return (
          <div>
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
          </div>
        );
      };

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
          <ServeGMCNumber />
          <ServeRegistrationNumber />
          <ServeNTNNumber />
          <ServeJob />
          <ServeMainHospital />
          <ServeMedicalSchool />
        </div>
      );
    };

    const ServeSupportingMembers = () => {
      if (isDERMPATHPRO) return null;

      const ServeSupportingMemberOne = () => {
        if (
          (applicationData && isBritishCosmeticDermatologyGroup) ||
          (applicationData && isBritishHairNailsSociety) ||
          (applicationData && isBritishSocietyGeriatricDermatology) ||
          (applicationData && isBritishSocietySkinCare)
        )
          return null;

        return (
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
        );
      };

      const ServeSupportingMemberTwo = () => {
        if (
          (applicationData && isStudent) ||
          (applicationData && isBritishCosmeticDermatologyGroup) ||
          (applicationData && isBritishHairNailsSociety) ||
          (applicationData && isBritishSocietyDermatopathology) ||
          (applicationData && isBritishSocietyGeriatricDermatology) ||
          (applicationData && isBritishSocietyMedicalDermatology) ||
          (applicationData && isBritishSocietyMedicalDermatologyAssociate) ||
          (applicationData && isBritishSocietySkinCare)
        )
          return null;

        return (
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
        );
      };

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
          <ServeSupportingMemberOne />
          <ServeSupportingMemberTwo />
        </div>
      );
    };

    const ServeUploads = () => {
      const ServeMRCPNumber = () => {
        if (
          (applicationData && isStudent) ||
          (applicationData && isAssociateOverseas) ||
          (applicationData && isDERMPATHPRO)
        )
          return null;

        return (
          <div>
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
          </div>
        );
      };

      const ServeCV = () => {
        if (applicationData && isDERMPATHPRO) return null;

        return (
          <div>
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

      const ServeCurrentGrade = () => {
        if (applicationData && !isDERMPATHPRO) return null;

        return (
          <div>
            <label style={styles.subTitle}>Current Grade</label>
            <input
              ref={gradeRef}
              type="text"
              className="form-control"
              placeholder="Curent Grade"
              style={styles.input}
            />
          </div>
        );
      };

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
          <ServeMRCPNumber />
          <ServeCV />
          <ServeCurrentGrade />
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
          onClick={handleSaveExit}
        >
          Save & Exit
        </div>
        <div className="blue-btn" onClick={handleNext}>
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
};

export default connect(RegistrationStepFour);
