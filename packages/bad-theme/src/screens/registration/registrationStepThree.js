import { useState, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import { Form } from "react-bootstrap";
import BlockWrapper from "../../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setApplicationDataAction,
} from "../../context";

const RegistrationStepThree = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, applicationType } = useAppState();

  console.log("applicationType", applicationType);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [type, setType] = useState(() => {
    if (applicationType && applicationType.type === "BAD")
      return "BAD Membership";
    return "";
  });
  const [category, setCategory] = useState(() => {
    if (applicationType && applicationType.apply_for_membership)
      return applicationType.apply_for_membership;
    return "";
  });

  const typeRef = useRef(null);
  const categoryRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = () => {
    const type = typeRef.current.value;
    const category = categoryRef.current.value;

    const details = {
      type,
      category,
    };

    console.log(details);
    setApplicationDataAction({
      dispatch,
      applicationData: { ...applicationData, ...details },
    });
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
          onClick={() =>
            setGoToAction({
              path: `/membership/`,
              actions,
            })
          }
        >
          Save & Exit
        </div>
        <div
          className="blue-btn"
          onClick={() => {
            handleSubmit();
            // setGoToAction({
            //   path: `/membership/step-4-professional-details/`,
            //   actions,
            // });
          }}
        >
          Next
        </div>
      </div>
    );
  };

  const ServeForm = () => {
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
        <label style={styles.subTitle}>Membership Type</label>
        <Form.Select
          ref={typeRef}
          style={styles.input}
          value={type}
          onChange={(e) => handleTypeChange(e)}
        >
          <option value="null" hidden>
            Membership Type
          </option>
          <option value="BAD Membership">BAD Membership</option>
          <option value="SIG Membership">SIG Membership</option>
        </Form.Select>

        <label style={styles.subTitle}>Membership Category</label>
        <Form.Select
          ref={categoryRef}
          style={styles.input}
          value={category}
          onChange={(e) => handleCategoryChange(e)}
        >
          <option value="null" hidden>
            Membership Category
          </option>
          <option value="Ordinary">Ordinary</option>
          <option value="Trainee">Trainee</option>
          <option value="Associate Trainee">Associate Trainee</option>
          <option value="Honorary">Honorary</option>
          <option value="Associate">Associate</option>
          <option value="GP">GP</option>
          <option value="Student">Student</option>
          <option value="Scientist and Allied Healthcare Professionals">
            Scientist and Allied Healthcare Professionals
          </option>
          <option value="Honorary Overseas">Honorary Overseas</option>
          <option value="Retired">Retired</option>
        </Form.Select>
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
  subTitle: {
    fontWeight: "bold",
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(RegistrationStepThree);
