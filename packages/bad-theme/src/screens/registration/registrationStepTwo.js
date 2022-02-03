import { useState, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import Avatar from "../../img/svg/profile.svg";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

import { UK_COUNTIES } from "../../config/data";
import { UK_COUNTRIES } from "../../config/data";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setApplicationDataAction,
} from "../../context";

const RegistrationStepTwo = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData } = useAppState();

  console.log("applicationData", applicationData);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const profilePhotoRef = useRef(null);
  const titleRef = useRef(null);
  const genderRef = useRef(null);
  const mobileRef = useRef(null);
  const addressLineOneRef = useRef(null);
  const addressLineTwoRef = useRef(null);
  const cityRef = useRef(null);
  const countryRef = useRef(null);
  const countyRef = useRef(null);
  const postcodeRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSubmit = () => {
    const profilePhoto = profilePhotoRef.current.files[0];
    const py3_title = titleRef.current.value;
    const gender = genderRef.current.value;
    const mobile = mobileRef.current.value;
    const addressLineOne = addressLineOneRef.current.value;
    const addressLineTwo = addressLineTwoRef.current.value;
    const city = cityRef.current.value;
    const country = countryRef.current.value;
    const county = countyRef.current.value;
    const postcode = postcodeRef.current.value;

    const details = {
      profilePhoto,
      py3_title,
      gender,
      mobile,
      addressLineOne,
      addressLineTwo,
      city,
      country,
      county,
      postcode,
    };

    console.log(details);
    setApplicationDataAction({
      dispatch,
      applicationData: { ...applicationData, ...details },
    });
  };

  // SERVERS ---------------------------------------------
  const SMF = () => {
    return <span style={{ color: colors.danger }}>*</span>;
  };

  const ServeCardImage = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const alt = "Profile Avatar";

    return (
      <div>
        <div style={{ width: 260, height: 260 }}>
          <Image
            src={profilePhoto || Avatar}
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
            ref={profilePhotoRef}
            onChange={() => {
              const file = profilePhotoRef.current.files[0];
              const objectURL = URL.createObjectURL(file);
              setProfilePhoto(objectURL);
            }}
            type="file"
            className="form-control"
            placeholder="Profile Photo"
            accept="image/*"
            style={styles.input}
          />
        </div>
      </div>
    );
  };

  const ServeForm = () => {
    const ServePersonalDetailsInput = () => {
      return (
        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>
            Title <SMF />
          </label>
          <Form.Select style={styles.input} ref={titleRef}>
            <option value="null" hidden>
              Professor, Dr, Mr, Miss, Ms
            </option>
            <option value="Dr.">Dr.</option>
            <option value="Mr.">Mr.</option>
            <option value="Miss">Miss</option>
            <option value="Ms">Ms</option>
            <option value="Professor">Professor</option>
          </Form.Select>
          <label>Gender</label>
          <Form.Select style={styles.input} ref={genderRef}>
            <option value="null" hidden>
              Male, Female, Transgender, Prefer Not To Answer
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender Male">Transgender Male</option>
            <option value="Transgender Female">Transgender Female</option>
            <option value="Gender Variant/Non-Conforming">
              Gender Variant/Non-Conforming
            </option>
            <option value="Not Listed">Not Listed</option>
            <option value="Prefer Not To Answer">Prefer Not To Answer</option>
            <option value="Unknown">Unknown</option>
          </Form.Select>
          <label>
            Mobile Number <SMF />
          </label>
          <input
            ref={mobileRef}
            type="tel"
            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
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
          style={{ display: "grid", gap: 10, paddingTop: `1em` }}
        >
          <label>
            Home Address <SMF />
          </label>
          <input
            ref={addressLineOneRef}
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            style={styles.input}
          />
          <input
            ref={addressLineTwoRef}
            type="text"
            className="form-control"
            placeholder="Address Line 2"
            style={styles.input}
          />
          <input
            ref={cityRef}
            type="text"
            className="form-control"
            placeholder="City"
            style={styles.input}
          />
          <Form.Select ref={countyRef} style={styles.input}>
            <option value="null" hidden>
              County/State
            </option>
            {UK_COUNTIES.map((item, key) => {
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </Form.Select>
          <Form.Select ref={countryRef} style={styles.input}>
            <option value="null" hidden>
              Country/State
            </option>
            {UK_COUNTRIES.map((item, key) => {
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </Form.Select>
          <input
            ref={postcodeRef}
            type="text"
            className="form-control"
            placeholder="Postcode"
            style={styles.input}
          />
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
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-1-the-process/`,
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
            setGoToAction({
              path: `/membership/step-3-category-selection/`,
              actions,
            });
          }}
        >
          Next
        </div>
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
    borderBottom: `1px solid ${colors.silverFillTwo}`,
    padding: `0 1em 0`,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontWeight: "bold",
    padding: `0.75em 0`,
  },
  mandatory: {
    padding: `0.75em 0`,
    borderBottom: `1px solid ${colors.silverFillTwo}`,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(RegistrationStepTwo);
