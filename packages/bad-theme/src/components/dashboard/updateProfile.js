import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

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
  getGenderAction,
} from "../../context";

const UpdateProfile = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, ethnicity, genderList } = useAppState();

  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bad_profile_photo_url: "",
    _birthdate: "",
    _gendercode: "",
    _py3_ethnicity: "",
  });
  const documentRef = useRef(null);
  const marginVertical = state.theme.marginVertical;
  const useEffectRef = useRef(true);

  useEffect(async () => {
    // ⬇️ get ethnicity choices from Dynamics
    if (!ethnicity) await getEthnicityAction({ state, dispatch });
    if (!genderList) await getGenderAction({ state, dispatch });

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
    if (isActiveUser._gendercode) handleSetData({ name: "_gendercode" });
    if (isActiveUser._birthdate) handleSetData({ name: "_birthdate" });
    if (isActiveUser._py3_ethnicity) handleSetData({ name: "_py3_ethnicity" });
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
    const birthdate = formData._birthdate;
    const gendercode = formData._gendercode;
    const py3_ethnicity = formData._py3_ethnicity;

    const data = Object.assign(
      {}, // add empty object
      { firstname }, // allow to pass empty values
      { lastname }, // allow to pass empty values
      !!bad_profile_photo_url && { bad_profile_photo_url },
      !!birthdate && { birthdate },
      !!gendercode && { gendercode: Number(gendercode) }, // convert to number for dynamics
      !!py3_ethnicity && { py3_ethnicity: Number(py3_ethnicity) } // convert to number for dynamics
    );
    console.log("🐞 ", data);

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
              name="_birthdate"
              type="date"
              value={formData._birthdate}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Your Date Of Birth"
            />
          </div>
          {genderList && (
            <div>
              <label>Gender</label>
              <Form.Select
                name="_gendercode"
                value={formData._gendercode}
                onChange={handleInputChange}
                className="input"
                // disabled
              >
                <option value="" hidden>
                  Male, Female, Transgender, Prefer Not To Answer
                </option>
                {genderList.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          )}
          {ethnicity && (
            <div style={styles.wrapper}>
              <label>Ethnicity</label>
              <Form.Select
                name="_py3_ethnicity"
                value={formData._py3_ethnicity}
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
