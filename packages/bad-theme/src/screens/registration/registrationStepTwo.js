import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction, sendFileToS3Action } from "../../context";
import SideBarMenu from "./sideBarMenu";
import Avatar from "../../img/svg/profile.svg";
import FileUpload from "../../img/svg/fileUpload.svg";
import BlockWrapper from "../../components/blockWrapper";

import { UK_COUNTIES } from "../../config/data";
import { UK_COUNTRIES } from "../../config/data";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setUserStoreAction } from "../../context";

const RegistrationStepTwo = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const profilePhotoRef = useRef(null);
  const titleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const genderRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);
  const addressLineOneRef = useRef(null);
  const addressLineTwoRef = useRef(null);
  const cityRef = useRef(null);
  const countryRef = useRef(null);
  const countyRef = useRef(null);
  const postcodeRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
    });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    let profilePhoto = profilePhotoRef.current.files[0];
    if (profilePhoto)
      profilePhoto = await sendFileToS3Action({
        state,
        dispatch,
        attachments: profilePhoto,
      });
    console.log("profilePhoto", profilePhoto);

    const py3_title = titleRef.current ? titleRef.current.value : null;
    const py3_firstname = firstNameRef.current
      ? firstNameRef.current.value
      : null;
    const py3_lastname = lastNameRef.current ? lastNameRef.current.value : null;
    const py3_gender = genderRef.current ? genderRef.current.value : null;
    const py3_email = emailRef.current ? emailRef.current.value : null;
    const py3_address1ine1 = addressLineOneRef.current
      ? addressLineOneRef.current.value
      : null;
    const py3_addressline2 = addressLineTwoRef.current
      ? addressLineTwoRef.current.value
      : null;
    const py3_addresstowncity = cityRef.current ? cityRef.current.value : null;
    const py3_addresscountry = countryRef.current
      ? countryRef.current.value
      : null;
    const py3_addresszippostalcode = postcodeRef.current
      ? postcodeRef.current.value
      : null;

    const data = {
      // profilePhoto, // field not present
      py3_firstname,
      py3_lastname,
      py3_title,
      py3_gender,
      py3_email,
      py3_mobilephone,
      py3_address1ine1,
      py3_addressline2,
      py3_addresstowncity,
      py3_addresscountry,
      py3_addresszippostalcode,
    };

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data,
    });
    if (isActiveUser)
      setGoToAction({
        path: `/membership/step-3-category-selection/`,
        actions,
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
          <Form.Select
            style={styles.input}
            ref={titleRef}
            defaultValue={applicationData ? applicationData[4].value : ""}
            onChange={(e) => (titleRef.current = e.target.value)}
          >
            <option value="" hidden>
              Professor, Dr, Mr, Miss, Ms
            </option>
            <option value="Dr">Dr</option>
            <option value="Mr">Mr</option>
            <option value="Miss">Miss</option>
            <option value="Ms">Ms</option>
            <option value="Professor">Professor</option>
          </Form.Select>
          <label>
            First Name <SMF />
          </label>
          <input
            ref={firstNameRef}
            defaultValue={applicationData ? applicationData[5].value : ""}
            type="text"
            className="form-control"
            placeholder="First Name"
            style={styles.input}
          />
          <label>
            Last Name <SMF />
          </label>
          <input
            ref={lastNameRef}
            defaultValue={applicationData ? applicationData[7].value : ""}
            type="text"
            className="form-control"
            placeholder="Last Name"
            style={styles.input}
          />
          <label>
            Gender <SMF />
          </label>
          <Form.Select
            style={styles.input}
            ref={genderRef}
            defaultValue={applicationData ? applicationData[9].value : ""}
            onChange={(e) => (genderRef.current = e.target.value)}
          >
            <option value="" hidden>
              Male, Female, Transgender, Prefer Not To Answer
            </option>
            <option value="215500000">Male</option>
            <option value="215500001">Female</option>
            <option value="215500004">Transgender Male</option>
            <option value="215500003">Transgender Female</option>
            <option value="215500005">Gender Variant/Non-Conforming</option>
            <option value="215500006">Not Listed</option>
            <option value="215500007">Prefer Not To Answer</option>
            <option value="215500002">Unknown</option>
          </Form.Select>
          <label>
            Email <SMF />
          </label>
          <input
            ref={emailRef}
            defaultValue={applicationData ? applicationData[11].value : ""}
            type="text"
            className="form-control"
            placeholder="Email"
            style={styles.input}
          />
          <label>
            Mobile Number <SMF />
          </label>
          <input
            ref={mobileRef}
            defaultValue={applicationData ? applicationData[12].value : ""}
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
            defaultValue={applicationData ? applicationData[28].value : ""}
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            style={styles.input}
          />
          <input
            ref={addressLineTwoRef}
            defaultValue={applicationData ? applicationData[29].value : ""}
            type="text"
            className="form-control"
            placeholder="Address Line 2"
            style={styles.input}
          />

          <Form.Select
            ref={countyRef}
            style={styles.input}
            defaultValue={applicationData ? applicationData[30].value : ""}
            onChange={(e) => (countyRef.current = e.target.value)}
          >
            <option value="" hidden>
              County/State
            </option>
            {UK_COUNTIES.map((item, key) => {
              console.log(item);
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </Form.Select>
          <Form.Select
            ref={countryRef}
            style={styles.input}
            defaultValue={applicationData ? applicationData[33].value : ""}
            onChange={(e) => countryRef.current(e.target.value)}
          >
            <option value="" hidden>
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
            defaultValue={applicationData ? applicationData[32].value : ""}
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
