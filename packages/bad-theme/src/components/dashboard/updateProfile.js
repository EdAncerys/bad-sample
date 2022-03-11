import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { ETHNIC_GROUPS, GENDER_GROUPS } from "../../config/data";
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
    birthdate: "",
    gendercode: "",
    py3_ethnicity: "",
  });
  const documentRef = useRef(null);
  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    if (!isActiveUser) return null;

    // map through user & update formData with values
    const handleSetData = ({ name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: isActiveUser[`${name}`] || "",
      }));
    };

    // populate profile information form Dynamics records
    if (isActiveUser.firstname) handleSetData({ name: "firstname" });
    if (isActiveUser.lastname) handleSetData({ name: "lastname" });
    if (isActiveUser.birthdate) handleSetData({ name: "birthdate" });
    if (isActiveUser.gendercode) handleSetData({ name: "gendercode" });
  }, [isActiveUser]);

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
    // console.log("formData", formData); // debug

    setIsFetching(true);
    const firstname = formData.firstname;
    const lastname = formData.lastname;
    const bad_profile_photo_url = formData.bad_profile_photo_url;
    const birthdate = formData.birthdate;
    const gendercode = formData.gendercode;
    const py3_ethnicity = formData.py3_ethnicity;

    const data = Object.assign(
      {}, // add empty object
      !!firstname && { firstname },
      !!lastname && { lastname },
      !!bad_profile_photo_url && { bad_profile_photo_url },
      !!birthdate && { birthdate },
      !!gendercode && { gendercode },
      !!py3_ethnicity && { py3_ethnicity }
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
          Personal Information:
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `1em 0 0`,
          }}
        >
          <div>
            <label>Your First Name</label>
            <div style={styles.wrapper}>
              <input
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Your First Name"
              />
            </div>
            <div style={styles.wrapper}>
              <label>Your Last Name</label>
              <input
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Your Last Name"
              />
            </div>
            <div style={styles.wrapper}>
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

          <div>
            <div style={styles.wrapper}>
              <label>Date Of Birth</label>
              <input
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Your Date Of Birth"
              />
            </div>
            <div style={styles.wrapper}>
              <label>Gender</label>
              <Form.Select
                name="py3_gender"
                value={formData.py3_gender}
                onChange={handleInputChange}
                className="input"
                disabled
              >
                <option value="" hidden>
                  Male, Female, Transgender, Prefer Not To Answer
                </option>
                {GENDER_GROUPS.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            <div style={styles.wrapper}>
              <label style={styles.subTitle}>What is your Ethnic Group?</label>
              <Form.Select
                name="py3_ethnicity"
                value={formData.py3_ethnicity}
                onChange={handleInputChange}
                className="input"
                disabled
              >
                <option value="" hidden>
                  Ethnic Group
                </option>
                {ETHNIC_GROUPS.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
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
  wrapper: {
    padding: "1em 0",
  },
};

export default connect(UpdateProfile);
