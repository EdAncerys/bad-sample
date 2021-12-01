import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/colors";
import SideBarMenu from "./sideBarMenu";
import Avatar from "../../img/svg/profile.svg";
import FileUpload from "../../img/svg/fileUpload.svg";
import { style } from "@mui/system";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ path }) => {
    actions.router.set(path);
  };

  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  // SERVERS ---------------------------------------------
  const ServeFileUploadInput = () => {
    const ServeImage = () => {
      const alt = "Upload";

      return (
        <div style={{ width: 30, height: 30 }}>
          <Image
            src={FileUpload}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    };

    return (
      <div>
        <label
          for="fileUpload"
          className="flex"
          style={{
            backgroundColor: colors.white,
            border: `1px solid ${colors.silver}`,
            borderRadius: 10,
            cursor: "pointer",
            padding: `3px 10px`,
          }}
        >
          <div
            className="flex"
            style={{
              fontSize: 12,
              color: colors.darkSilver,
              alignItems: "center",
            }}
          >
            Profile Photo
          </div>
          <ServeImage />
        </label>
        <input
          id="fileUpload"
          type="file"
          className="form-control"
          placeholder="Profile Photo"
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    );
  };

  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      return (
        <div
          className="form-group"
          style={{
            display: "grid",
            gap: 5,
            padding: `2em 0`,
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          <label style={style.subtitle}>
            GMC Number <SMF />
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            placeholder="GMC Number"
            style={styles.input}
          />
          <label style={style.subtitle}>
            Regulatory Body Registration Number
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Regulatory Body Registration Number"
            style={styles.input}
          />
          <label style={style.subtitle}>NTN Number</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            placeholder="NTN Number"
            style={styles.input}
          />
          <label style={style.subtitle}>
            Current job title <SMF />
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Current job title"
            style={styles.input}
          />
          <label style={style.subtitle}>
            GP Practice/Hospital <SMF />
          </label>
          <Form.Select aria-label="Default select example" style={styles.input}>
            <option style={styles.option}>GP Practice/Hospital</option>
            <option value="1">Hospital One</option>
            <option value="2">Hospital Two</option>
            <option value="3">Hospital Three</option>
            <option value="3">Hospital Four</option>
          </Form.Select>
          <label style={style.subtitle}>Medical School</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
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
            padding: `2em 0`,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 5,
            }}
          >
            <label style={style.subtitle}>
              Supporting Member 1<SMF />:
            </label>
            <label style={style.subtitle}>First Name</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={style.subtitle}>Last Name</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={style.subtitle}>E-mail Address</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={style.subtitle}>Confirm Their E-mail Address</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
          </div>
          <div
            style={{
              display: "grid",
              gap: 5,
            }}
          >
            <label style={style.subtitle}>
              Supporting Member 2<SMF />:
            </label>
            <label style={style.subtitle}>First Name</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={style.subtitle}>Last Name</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={style.subtitle}>E-mail Address</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={style.subtitle}>Confirm Their E-mail Address</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
          </div>
        </div>
      );
    };

    const ServeUploadsInput = () => {
      return (
        <div
          className="form-group"
          style={{
            display: "grid",
            gap: 5,
            padding: `1em 0 2em`,
            borderTop: `1px solid ${colors.darkSilver}`,
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          <label style={style.subtitle}>
            MRCP
            <SMF />
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            placeholder="MRCP"
            style={styles.input}
          />
          <ServeFileUploadInput />
        </div>
      );
    };

    return (
      <div>
        <ServePersonalDetailsInput />
        <ServeSupportingMembers />
        <ServeUploadsInput />
      </div>
    );
  };

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
            handleGoToPath({ path: `/registration/step-3-category-selection/` })
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
            handleGoToPath({ path: `/registration/step-3-category-selection/` })
          }
        >
          Next
        </button>
      </div>
    );
  };

  const ServeAgreements = () => {
    return (
      <div className="flex-col form-check" style={{ padding: `1em 0` }}>
        <div
          className="flex"
          style={{ alignItems: "center", padding: `1em 0` }}
        >
          <div>
            <input
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label">
              I have read the{" "}
              <span
                style={styles.TC}
                onClick={actions.context.setCreateAccountAction}
              >
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
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label">
              <span
                style={styles.TC}
                onClick={actions.context.setCreateAccountAction}
              >
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
        <div style={styles.wrapper}>
          <div style={styles.title}>Professional Details</div>
          <div style={{ paddingTop: `0.75em` }}>
            How it works dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ut
            tellus elementum sagittis vitae et. Justo donec enim diam vulputate
            ut pharetra sit. Purus semper eget duis at tellus at. Sed adipiscing
            diam donec adipiscing tristique risus. A cras semper auctor neque
            vitae tempus quam. Ac auctor augue
          </div>
          <div style={styles.mandatory}>
            <SMF />
            Mandatory fields
          </div>
          <div
            style={styles.link}
            onClick={() => handleGoToPath({ path: `/` })}
          >
            Memberships Categories
          </div>

          <div style={styles.title}>Category Selected : GP</div>
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
  inputContainer: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
    padding: `2em 0`,
  },
  wrapper: {
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
  mandatory: {
    padding: `0.75em 0`,
    borderBottom: `1px solid ${colors.darkSilver}`,
  },
  input: {
    borderRadius: 10,
    color: colors.darkSilver,
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
