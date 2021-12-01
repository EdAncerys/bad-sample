import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import SideBarMenu from "./sideBarMenu";
import { Form } from "react-bootstrap";

const RegistrationStepThree = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ path }) => {
    actions.router.set(path);
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `1em 0` }}
      >
        <button
          type="submit"
          className="btn btn-outline-secondary"
          onClick={() =>
            handleGoToPath({
              path: `/registration/step-2-personal-information/`,
            })
          }
        >
          Back
        </button>
        <button
          type="submit"
          className="btn btn-outline-secondary"
          style={{ margin: `0 1em` }}
          onClick={() => handleGoToPath({ path: `/` })}
        >
          Save & Exit
        </button>
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() =>
            handleGoToPath({
              path: `/registration/step-4-professional-details/`,
            })
          }
        >
          Next
        </button>
      </div>
    );
  };

  const ServeForm = () => {
    return (
      <div
        className="form-group"
        style={{
          display: "grid",
          gap: 5,
          padding: `1em 0 2em`,
          borderTop: `1px solid ${colors.darkSilver}`,
        }}
      >
        <label style={styles.subTitle}>Title</label>
        <Form.Select aria-label="Default select example" style={styles.input}>
          <option style={styles.option}>Membership Category</option>
          <option value="1">Category one</option>
          <option value="2">Category Two</option>
          <option value="3">Category Three</option>
          <option value="3">Category Four</option>
        </Form.Select>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <div style={styles.title}>Category Selection</div>
          <div style={{ paddingTop: `0.75em` }}>
            How it works dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ut
            tellus elementum sagittis vitae et. Justo donec enim diam vulputate
            ut pharetra sit. Purus semper eget duis at tellus at. Sed adipiscing
            diam donec adipiscing tristique risus. A cras semper auctor neque
            vitae tempus quam. Ac auctor augue
          </div>
          <div
            style={styles.link}
            onClick={() => handleGoToPath({ path: `/` })}
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
    <div style={{ backgroundColor: colors.white }}>
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
    </div>
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
    borderBottom: `1px solid ${colors.darkSilver}`,
    margin: `0 1em 0`,
  },
  title: { fontSize: 22, fontWeight: "bold", color: colors.black },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    padding: `0.75em 0`,
  },
  link: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.blue,
    textDecoration: "underline",
    cursor: "pointer",
    padding: `0.75em 0`,
  },
  input: {
    borderRadius: 10,
    color: colors.darkSilver,
  },
};

export default connect(RegistrationStepThree);
