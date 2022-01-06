import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import Avatar from "../../img/svg/profile.svg";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

const RegistrationStepTwo = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  const ServeFileUploadInput = () => {
    const ServeImage = () => {
      const alt = "Upload";

      return (
        <div style={{ width: 30, height: 30, padding: `7px 10px 0 0` }}>
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
            border: `1px solid ${colors.darkSilver}`,
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <div
            className="flex"
            style={{
              fontSize: 12,
              color: colors.darkSilver,
              padding: `1em 1.5em`,
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

  const ServeCardImage = () => {
    const alt = "Profile Avatar";

    return (
      <div>
        <div style={{ width: 260, height: 260 }}>
          <Image
            src={Avatar}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={styles.subTitle}>Upload A Profile Photo</div>

        <div style={styles.subTitle}>
          <input
            type="file"
            className="form-control"
            placeholder="Profile Photo"
            accept="image/*"
            style={styles.input}
          />
        </div>

        <ServeFileUploadInput />
      </div>
    );
  };

  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      return (
        <div className="form-group" style={{ display: "grid", gap: 5 }}>
          <label>
            Title <SMF />
          </label>
          <Form.Select aria-label="Default select example" style={styles.input}>
            <option>Professor, Dr, Mr, Miss, Ms</option>
            <option value="1">Dr.</option>
            <option value="2">Mr.</option>
            <option value="3">Miss</option>
            <option value="3">Ms</option>
          </Form.Select>
          <label>Gender</label>
          <Form.Select aria-label="Default select example" style={styles.input}>
            <option>Male, Female, Transgender…</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Transgender</option>
            <option value="3">Prefer not to say</option>
          </Form.Select>
          <label>
            Mobile Number <SMF />
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="tel"
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            className="form-control"
            placeholder="Eg 07999999999"
            style={styles.input}
          />
        </div>
      );
    };

    const ServeAddressInput = () => {
      return (
        <div
          className="form-group"
          style={{ display: "grid", gap: 5, padding: `1em 0` }}
        >
          <label>
            Home Address <SMF />
          </label>
          <input
            id="addressLineOne"
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            style={styles.input}
          />
          <input
            id="addressLineTwo"
            type="text"
            className="form-control"
            placeholder="Address Line 2"
            style={styles.input}
          />
          <input
            id="city"
            type="text"
            className="form-control"
            placeholder="City"
            style={styles.input}
          />
          <input
            id="country"
            type="text"
            className="form-control"
            placeholder="Country"
            style={styles.input}
          />
          <input
            id="postcode"
            type="text"
            className="form-control"
            placeholder="Postcode"
            style={styles.input}
          />
          <Form.Select
            id="country"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>Country</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </div>
      );
    };

    return (
      <div>
        <ServePersonalDetailsInput />
        <ServeAddressInput />
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
              path: `https://badadmin.skylarkdev.co/membership/register/step-1-the-process/`,
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
          onClick={() =>
            setGoToAction({
              path: `/`,
              actions,
            })
          }
        >
          Save & Exit
        </button>
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership/register/step-3-category-selection/`,
              actions,
            })
          }
        >
          Next
        </button>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <div className="primary-title" style={styles.title}>
            Personal Information
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
            <SMF /> Mandatory fields
          </div>

          <div style={styles.inputContainer}>
            <ServeCardImage />
            <ServeForm />
          </div>
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
  inputContainer: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
    padding: `2em 0`,
  },
  wrapper: {
    borderBottom: `1px solid ${colors.darkSilver}`,
    margin: `0 1em 0`,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.softBlack,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.softBlack,
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
};

export default connect(RegistrationStepTwo);
