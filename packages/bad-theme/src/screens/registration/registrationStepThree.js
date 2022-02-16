import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import SideBarMenu from "./sideBarMenu";
import { Form } from "react-bootstrap";
import BlockWrapper from "../../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  getBADMembershipSubscriptionData,
  setGoToAction,
} from "../../context";

const RegistrationStepThree = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.category][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [formData, setFormData] = useState({
    bad_organisedfor: "",
    bad_categorytype: "",
  });

  // ⏬ populate form data values from applicationData
  useEffect(() => {
    const handleSetData = ({ data, name }) => {
      console.log(name);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      // set data from Dynamics membership object
      if (data.name === "bad_organisedfor")
        handleSetData({ data, name: "bad_organisedfor" });
      // set data from custom object type
      if (data.bad_categorytype)
        setFormData((prevFormData) => ({
          ...prevFormData,
          bad_categorytype: data.bad_categorytype,
        }));
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    // ⏬ get appropriate membership ID
    // const membershipId = await getBADMembershipSubscriptionData({
    //   state,
    //   category: formData.bad_organisedfor === "810170000" ? "BAD" : "SIG",
    //   type: formData.type,
    // });
    // console.log("Application cat id ", membershipId); // debug

    // ⏬ create user application record in Store
    // await setUserStoreAction({
    //   state,
    //   dispatch,
    //   applicationData,
    //   isActiveUser,
    //   data: {
    //     bad_organisedfor: formData.bad_organisedfor,
    //     core_membershipsubscriptionplanid: membershipId, // type of membership for application
    //     bad_applicationfor: "810170000", // silent assignment
    //   },
    // });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "bad_organisedfor")
      // reset form on category change
      setFormData((prevFormData) => ({
        ...prevFormData,
        bad_categorytype: "",
      }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = async () => {
    // form value validations
    if (!formData.bad_organisedfor || !formData.bad_categorytype) {
      console.log("FORM INPUTS NOT VALIDATED");
      return;
    }

    try {
      // ⏬ get appropriate membership ID
      const membershipData = await getBADMembershipSubscriptionData({
        state,
        category: formData.bad_organisedfor === "810170000" ? "BAD" : "SIG",
        type: formData.bad_categorytype,
      });
      if (!membershipData) throw new Error("Failed to get membership data");
      console.log("membershipData", membershipData); // debug

      // ⏬ create user application record in Store
      await setUserStoreAction({
        state,
        dispatch,
        applicationData,
        isActiveUser,
        membershipApplication: membershipData,
        data: {
          bad_organisedfor: formData.bad_organisedfor, // BAD members category
          core_membershipsubscriptionplanid:
            membershipData.core_membershipsubscriptionplanid, // type of membership for application
          bad_applicationfor: "810170000", // silent assignment
        },
      });
    } catch (error) {
      console.log("ERROR: ", error);
    } finally {
      if (isActiveUser)
        setGoToAction({
          path: `/membership/step-4-professional-details/`,
          actions,
        });
    }
  };

  // SERVERS ---------------------------------------------
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
              path: `/membership/step-2-personal-information/`,
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

  const ServeForm = () => {
    const ServeBADMembershipCategory = () => {
      if (formData.bad_organisedfor !== "810170000") return null;

      return (
        <div>
          <label className="bold">Membership Category</label>
          <Form.Select
            name="bad_categorytype"
            value={formData.bad_categorytype}
            onChange={handleChange}
            className="input"
            // disabled
          >
            <option value="" hidden>
              Membership Category
            </option>
            <option value="Student">Student</option>
            <option value="Trainee">Trainee</option>
            <option value="Associate Trainee">Associate Trainee</option>
            <option value="Associate">Associate</option>
            <option value="Associate Overseas">Associate Overseas</option>
            <option value="GP">GP</option>
            <option value="Career Grade">Career Grade</option>
            <option value="Ordinary">Ordinary</option>
            <option value="Ordinary SAS">Ordinary SAS</option>
            <option value="Allied Healthcare Professional">
              Allied Healthcare Professional
            </option>
          </Form.Select>
        </div>
      );
    };

    const ServeSIGMembershipCategory = () => {
      if (formData.bad_organisedfor !== "810170001") return null;

      return (
        <div>
          <label className="bold">Membership Category</label>
          <Form.Select
            name="bad_categorytype"
            value={formData.bad_categorytype}
            onChange={handleChange}
            className="input"
            // disabled
          >
            <option value="" hidden>
              Membership Category
            </option>

            <option value="British Cosmetic Dermatology Group">
              British Cosmetic Dermatology Group
            </option>
            <option value="British Hair and Nails Society">
              British Hair and Nails Society
            </option>
            <option value="British Photodermatology Group">
              British Photodermatology Group
            </option>
            <option value="British Society of Cutaneous Allergy">
              British Society of Cutaneous Allergy
            </option>
            <option value="British Society of Cutaneous Allergy Overseas">
              British Society of Cutaneous Allergy Overseas
            </option>
            <option value="British Society for Dermatopathology">
              British Society for Dermatopathology
            </option>
            <option value="British Society for Dermatological Surgery">
              British Society for Dermatological Surgery
            </option>
            <option value="British Society for Dermatological Surgery Associate">
              British Society for Dermatological Surgery Associate
            </option>
            <option value="British Society for Dermatological Surgery International">
              British Society for Dermatological Surgery International
            </option>
            <option value="British Society for Dermatological Surgery Trainnee">
              British Society for Dermatological Surgery Trainnee
            </option>
            <option value="British Society for Investigative Dermatology">
              British Society for Investigative Dermatology
            </option>
            <option value="British Society for Medical Dermatology">
              British Society for Medical Dermatology
            </option>
            <option value="British Society for Medical Dermatology Associate">
              British Society for Medical Dermatology Associate
            </option>
            <option value="British Society for Paediatric Dermatology">
              British Society for Paediatric Dermatology
            </option>
            <option value="British Society for Paediatric Dermatology Trainee">
              British Society for Paediatric Dermatology Trainee
            </option>
            <option value="British Society for Skin Care in Immunocompromised Individuals">
              British Society for Skin Care in Immunocompromised Individuals
            </option>
            <option value="The Dowling Club">The Dowling Club</option>
            <option value="DERMPATHPRO">DERMPATHPRO</option>
          </Form.Select>
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
          paddingTop: `1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <label className="bold">Membership Type</label>
        <Form.Select
          name="bad_organisedfor"
          value={formData.bad_organisedfor}
          onChange={handleChange}
          className="input"
        >
          <option value="null" hidden>
            Membership Type
          </option>
          <option value="810170000">BAD Membership</option>
          <option value="810170001">SIG Membership</option>
        </Form.Select>

        <ServeBADMembershipCategory />
        <ServeSIGMembershipCategory />
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <div className="primary-title" style={styles.title}>
            Category Selection
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
            Memberships Categories
          </div>
          <ServeForm />
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
    padding: `0 1em 2em 1em`,
  },
  title: {
    fontSize: 20,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(RegistrationStepThree);
