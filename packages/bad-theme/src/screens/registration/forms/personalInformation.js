import { useState, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import Avatar from "../../../img/svg/profile.svg";
import { colors } from "../../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  setGoToAction,
} from "../../../context";

const PersonalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const [formData, setFormData] = useState({
    py3_title: "",
    py3_firstname: "",
    py3_lastname: "",
    py3_gender: "",
    py3_email: "",
    py3_mobilephone: "",
    py3_address1ine1: "",
    py3_addressline2: "",
    py3_addresstowncity: "",
    py3_addresscountystate: "",
    py3_addresszippostalcode: "",
    py3_addresscountry: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const profilePhotoRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    console.log(formData);

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });

    let slug = `/membership/step-3-category-selection/`;
    if (isActiveUser) setGoToAction({ path: slug, actions });
  };

  const handleDocUploadChange = async () => {
    let document = profilePhotoRef.current
      ? profilePhotoRef.current.files[0]
      : null;
    if (document)
      document = await sendFileToS3Action({
        state,
        dispatch,
        attachments: document,
      });
    console.log("document", document); // debug
    console.log(formData); // debug

    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   cvDocument: document,
    // }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(formData); // debug
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

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          justifyContent: "space-between",
          gap: 20,
          padding: `2em 0`,
        }}
      >
        <div>
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src={profilePhoto || Avatar}
              alt="Profile Avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="bold" style={{ padding: `1em 0` }}>
            Upload A Profile Photo
          </div>

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

        <form>
          <div style={{ padding: `0 1em 1em` }}>
            <label className="required form-label">Title</label>
            <Form.Select
              name="py3_title"
              value={formData.py3_title}
              onChange={handleInputChange}
              className="input"
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

            <label className="form-label required">First Name</label>
            <input
              name="py3_firstname"
              value={formData.py3_firstname}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="First Name"
            />

            <label className="form-label required">Last Name</label>
            <input
              name="py3_lastname"
              value={formData.py3_lastname}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Last Name"
            />

            <label className="required form-label">Gender</label>
            <Form.Select
              name="py3_gender"
              value={formData.py3_gender}
              onChange={handleInputChange}
              className="input"
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

            <label className="form-label required">Email</label>
            <input
              name="py3_email"
              value={formData.py3_email}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Email"
            />

            <label className="form-label required">Mobile Number</label>
            <input
              name="py3_mobilephone"
              value={formData.py3_mobilephone}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Mobile Number"
            />
          </div>

          <div
            style={{
              padding: `1em 1em`,
              display: "grid",
              gap: 10,
            }}
          >
            <label className="required form-label">Home Address</label>
            <input
              name="py3_address1ine1"
              value={formData.py3_address1ine1}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Address Line 1"
            />
            <input
              name="py3_addressline2"
              value={formData.py3_addressline2}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Address Line 2"
            />
            <input
              name="py3_addresstowncity"
              value={formData.py3_addresstowncity}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="City"
            />
            <input
              name="py3_addresscountystate"
              value={formData.py3_addresscountystate}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="County/State"
            />
            <input
              name="py3_addresszippostalcode"
              value={formData.py3_addresszippostalcode}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Postcode/Zip"
            />
            <input
              name="py3_addresscountry"
              value={formData.py3_addresscountry}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Country"
            />
          </div>
        </form>
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PersonalDetails);
