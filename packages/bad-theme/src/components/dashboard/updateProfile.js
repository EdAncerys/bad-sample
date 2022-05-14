import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { ETHNIC_GROUPS, GENDER_GROUPS } from "../../config/data";
import ActionPlaceholder from "../actionPlaceholder";
import ProfileAvatar from "./profileAvatar";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  sendFileToS3Action,
  updateProfileAction,
  muiQuery,
  setErrorAction,
  getEthnicityAction,
} from "../../context";

const UpdateProfile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, ethnicity } = useAppState();

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
  const useEffectRef = useRef(true);

  useEffect(async () => {
    // ⬇️ get ethnicity choices from Dynamics
    if (!ethnicity) await getEthnicityAction({ state, dispatch });

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

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
    if (isActiveUser.gendercode) handleSetData({ name: "gendercode" });
    if (isActiveUser.birthdate) handleSetData({ name: "birthdate" });
    if (isActiveUser.py3_ethnicity) handleSetData({ name: "py3_ethnicity" });
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDocUploadChange = async (e) => {
    let bad_profile_photo_url = e.target.files[0];

    if (bad_profile_photo_url)
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: bad_profile_photo_url,
      });
    // console.log("bad_profile_photo_url", bad_profile_photo_url); // debug

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["bad_profile_photo_url"]: bad_profile_photo_url, // update formData
    }));
  };

  const handleProfileUpdate = async () => {
    const firstname = formData.firstname;
    const lastname = formData.lastname;
    const bad_profile_photo_url = formData.bad_profile_photo_url;
    const birthdate = formData.birthdate;
    const gendercode = formData.gendercode;
    const py3_ethnicity = formData.py3_ethnicity;
    // const bad_ethnicity = formData.py3_ethnicity; // application field value

    const data = Object.assign(
      {}, // add empty object
      !!firstname && { firstname },
      !!lastname && { lastname },
      !!bad_profile_photo_url && { bad_profile_photo_url },
      !!birthdate && { birthdate },
      !!gendercode && { gendercode },
      !!py3_ethnicity && { py3_ethnicity }
    );
    // console.log("data", data); // debug

    try {
      setIsFetching(true);
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
      });
      if (!response) throw new Error("Error updating profile");
      // display error message
      setErrorAction({
        dispatch,
        isError: { message: `Personal information updated successfully` },
      });
    } catch (error) {
      // console.log("error", error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update personal information. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: !lg ? "flex-end" : "center",
          padding: `0 4em 2em 0`,
        }}
      >
        <div className="blue-btn" onClick={handleProfileUpdate}>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: !lg ? `1fr 1fr` : "1fr",
          justifyContent: "space-between",
          gap: 20,
          padding: !lg ? `2em 4em` : "1em",
        }}
      >
        <div className="flex-col">
          <div className="primary-title" style={{ fontSize: 20 }}>
            Personal Information:
          </div>

          <div style={styles.wrapper}>
            <label>Your First Name</label>
            <input
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Your First Name"
            />
          </div>
          <div>
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
          <div>
            <label>Gender</label>
            <Form.Select
              name="gendercode"
              value={formData.gendercode}
              onChange={handleInputChange}
              className="input"
              // disabled
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
          {ethnicity && (
            <div style={styles.wrapper}>
              <label>Ethnicity</label>
              <Form.Select
                name="py3_ethnicity"
                value={formData.py3_ethnicity}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Ethnicity
                </option>
                {ethnicity.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          )}
          <div>
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
        <ProfileAvatar isPreview={formData.bad_profile_photo_url} />
      </div>
      <ServeActions />
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
