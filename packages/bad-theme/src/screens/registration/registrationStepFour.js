import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

const RegistrationStepFour = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

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
          htmlFor="fileUpload"
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
            Upload Your CV
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
          <label style={styles.subTitle}>
            GMC Number <SMF />
          </label>
          <input
            id="gmcNumber"
            type="text"
            className="form-control"
            placeholder="GMC Number"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Regulatory Body Registration Number
          </label>
          <input
            id="registrationNumber"
            type="text"
            className="form-control"
            placeholder="Regulatory Body Registration Number"
            style={styles.input}
          />
          <label style={styles.subTitle}>NTN Number</label>
          <input
            id="ntnNumber"
            type="text"
            className="form-control"
            placeholder="NTN Number"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Current job title <SMF />
          </label>
          <input
            id="jobTitle"
            type="text"
            className="form-control"
            placeholder="Current job title"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            GP Practice/Hospital <SMF />
          </label>
          <Form.Select
            id="hospital"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>GP Practice/Hospital</option>
            <option value="1">Hospital One</option>
            <option value="2">Hospital Two</option>
            <option value="3">Hospital Three</option>
            <option value="3">Hospital Four</option>
          </Form.Select>
          <label style={styles.subTitle}>Medical School</label>
          <input
            id="medicalSchool"
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
            <label style={styles.subTitle}>
              Supporting Member 1<SMF />:
            </label>
            <label style={styles.subTitle}>First Name</label>
            <input
              id="supportMemberOneFirstName"
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>Last Name</label>
            <input
              id="supportMemberOneLastName"
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>E-mail Address</label>
            <input
              id="supportMemberOneEmail"
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={styles.subTitle}>Confirm Their E-mail Address</label>
            <input
              id="supportMemberOneConfirmEmail"
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
            <label style={styles.subTitle}>
              Supporting Member 2<SMF />:
            </label>
            <label style={styles.subTitle}>First Name</label>
            <input
              id="supportMemberTwoFirstName"
              type="text"
              className="form-control"
              placeholder="First Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>Last Name</label>
            <input
              id="supportMemberTwoLastName"
              type="text"
              className="form-control"
              placeholder="Last Name"
              style={styles.input}
            />
            <label style={styles.subTitle}>E-mail Address</label>
            <input
              id="supportMemberTwoEmail"
              type="email"
              className="form-control"
              placeholder="E-mail Address"
              style={styles.input}
            />
            <label style={styles.subTitle}>Confirm Their E-mail Address</label>
            <input
              id="supportMemberTwoConfirmEmail"
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
            gap: 20,
            padding: `1em 0 2em`,
            borderTop: `1px solid ${colors.darkSilver}`,
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          <label style={styles.subTitle}>
            MRCP
            <SMF />
          </label>
          <input
            id="mrcp"
            type="text"
            className="form-control"
            placeholder="MRCP"
            style={styles.input}
          />
          <label style={styles.subTitle}>
            Upload Your CV
            <SMF />
          </label>
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
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/register/step-3-category-selection/`,
              actions,
            })
          }
        >
          Back
        </button>
        <button
          type="submit"
          className="btn btn-outline-secondary"
          style={{ margin: `0 1em` }}
          onClick={() => setGoToAction({ path: `/`, actions })}
        >
          Save & Exit
        </button>
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/register/registration-thank-you/`,
              actions,
            })
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
                onClick={actions.context.setCreateAccountModalAction}
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
                onClick={actions.context.setCreateAccountModalAction}
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
          <div style={styles.mandatory}>
            <SMF />
            Mandatory fields
          </div>
          <div
            style={styles.link}
            onClick={() => setGoToAction({ path: `/`, actions })}
          >
            Memberships Categories
          </div>

          <div className="primary-title" style={styles.title}>
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
  wrapper: {
    margin: `0 1em 0`,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.black,
  },
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
