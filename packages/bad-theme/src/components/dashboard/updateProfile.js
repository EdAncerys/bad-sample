import { useState, useRef } from "react";
import { connect } from "frontity";

import ActionPlaceholder from "../actionPlaceholder";
import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  sendFileToS3Action,
  updateProfileAction,
} from "../../context";

const UpdateProfile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bad_profile_photo_url: "",
    py3_email: "",
    password: "",
  });
  const documentRef = useRef(null);

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // console.log(formData); // debug
  };

  const handleDocUploadChange = async (e) => {
    let bad_profile_photo_url = e.target.files[0];

    if (bad_profile_photo_url)
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: bad_profile_photo_url,
        isPicture: true, // 🐞 dont append file type for images bug in S3
      });
    console.log("bad_profile_photo_url", bad_profile_photo_url); // debug

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["bad_profile_photo_url"]: bad_profile_photo_url, // update formData
    }));
  };

  const handleProfileUpdate = async () => {
    setIsFetching(true);
    console.log("formData", formData); // debug

    const firstname = formData.firstname;
    const lastname = formData.lastname;
    const bad_profile_photo_url = formData.bad_profile_photo_url;

    const data = Object.assign(
      {}, // add empty object
      !!firstname && { firstname },
      !!lastname && { lastname },
      !!bad_profile_photo_url && { bad_profile_photo_url }
    );
    console.log("data", data); // debug

    try {
      await updateProfileAction({ state, dispatch, data, isActiveUser });
      console.log("⬇️ profile details successfully updated ⬇️ "); // debug
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{ position: "relative", marginBottom: `${marginVertical}px` }}
    >
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div style={{ padding: `2em 4em` }}>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Personal Details:
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `1em 0 0`,
          }}
        >
          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>Your First Name</label>
            <input
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Your First Name"
            />
            <label>Your Last Name</label>
            <input
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Your Last Name"
            />
          </div>

          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>Your Contact E-mail Address</label>
            <input
              name="py3_email"
              value={formData.py3_email}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Your Contact E-mail Address"
              disabled
            />
            <label>Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Password"
              disabled
            />
          </div>

          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>Upload A Profile Photo</label>
            <input
              ref={documentRef}
              onChange={handleDocUploadChange}
              type="file"
              className="form-control input"
              placeholder="Profile Photo"
              accept="image/png, image/jpeg"
            />
          </div>
        </div>
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default connect(UpdateProfile);
