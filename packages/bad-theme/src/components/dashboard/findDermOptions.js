import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import ProfileAvatar from "./profileAvatar";
import ActionPlaceholder from "../actionPlaceholder";

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  setErrorAction,
  useAppDispatch,
  muiQuery,
  sendFileToS3Action,
  updateProfileAction,
} from "../../context";

const FindDermatologistOptions = ({ state }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps, refreshJWT } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [findDerm, setFindDerm] = useState(null);
  const [formData, setFormData] = useState({
    bad_includeinfindadermatologist: "",
    address3_line1: "",
    address3_line2: "",
    address3_postalcode: "",
    address3_city: "",
    bad_mainhosptialweb: "",
    bad_web1: "",
    bad_web2: "",
    bad_web3: "",
    bad_findadermatologisttext: "",
    bad_profile_photo_url: "",
  });
  const documentRef = useRef(null);

  useEffect(() => {
    if (!isActiveUser) return null;

    // map through user & update formData with values
    const handleSetData = ({ name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: isActiveUser[`${name}`],
      }));
    };

    // 📌 populate profile information form Dynamics records
    handleSetData({ name: "bad_includeinfindadermatologist" });
    if (isActiveUser.address3_postalcode)
      handleSetData({ name: "address3_postalcode" });
    if (isActiveUser.address3_line1) handleSetData({ name: "address3_line1" });
    if (isActiveUser.address3_line2) handleSetData({ name: "address3_line2" });
    if (isActiveUser.address3_city) handleSetData({ name: "address3_city" });
    if (isActiveUser.bad_mainhosptialweb)
      handleSetData({ name: "bad_mainhosptialweb" });
    if (isActiveUser.bad_web1) handleSetData({ name: "bad_web1" });
    if (isActiveUser.bad_web1) handleSetData({ name: "bad_web2" });
    if (isActiveUser.bad_web1) handleSetData({ name: "bad_web3" });
    if (isActiveUser.bad_findadermatologisttext)
      handleSetData({ name: "bad_findadermatologisttext" });

    // check if user have Ordinary or Honory app then set setFindDerm to true
    if (dynamicsApps) {
      const isMember = dynamicsApps.subs.data.filter(
        (app) =>
          app.bad_categorytype.includes("Honory") ||
          app.bad_categorytype.includes("Ordinary")
      );
      // show find dermatologist section for applicable users
      if (isMember.length > 0) setFindDerm(true);
    }
  }, [isActiveUser, dynamicsApps]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileUpdate = async () => {
    let bad_includeinfindadermatologist =
      formData.bad_includeinfindadermatologist;
    let address3_line1 = formData.address3_line1;
    let address3_line2 = formData.address3_line2;
    let address3_postalcode = formData.address3_postalcode;
    let address3_city = formData.address3_city;
    let bad_mainhosptialweb = formData.bad_mainhosptialweb;
    let bad_web1 = formData.bad_web1;
    let bad_web2 = formData.bad_web2;
    let bad_web3 = formData.bad_web3;
    let bad_findadermatologisttext = formData.bad_findadermatologisttext;
    let bad_profile_photo_url = formData.bad_profile_photo_url;

    const data = {
      bad_includeinfindadermatologist,
      address3_line1,
      address3_line2,
      address3_postalcode,
      address3_city,
      bad_mainhosptialweb,
      bad_web1,
      bad_web2,
      bad_web3,
      bad_findadermatologisttext,
      bad_profile_photo_url,
    };

    try {
      setIsFetching(true);
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
        refreshJWT,
      });
      if (!response) throw new Error("Error updating profile");
      // display error message
      setErrorAction({
        dispatch,
        isError: {
          message: `Find a Dermatologist information updated successfully`,
        },
      });
    } catch (error) {
      console.log("error", error);
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

  const handleDocUploadChange = async (e) => {
    let bad_profile_photo_url = e.target.files[0];

    if (bad_profile_photo_url)
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: bad_profile_photo_url,
        refreshJWT,
      });
    // console.log("bad_profile_photo_url", bad_profile_photo_url); // debug

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["bad_profile_photo_url"]: bad_profile_photo_url, // update formData
    }));
  };

  // 📌 hide component if user is not a member
  if (!findDerm) return null;

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="shadow"
        style={{
          padding: !lg ? `2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div style={{ display: "grid" }}>
          <div className="flex-col">
            <div
              className="flex"
              style={{ flexDirection: !lg ? null : "column-reverse" }}
            >
              <div className="flex-col" style={{ flex: 1.25 }}>
                <div style={{ textAlign: "justify" }}>
                  The Find a Dermatologist feature is a service where members of
                  the public can search for Consultant Dermatologists by
                  postcode proximity. Opting in allows our Consultant members to
                  provide the public with further information about their
                  dermatological specialties and work. Your personal message,
                  main place of work and up to three private practice websites
                  will be displayed on your search results profile.
                </div>
                <div>
                  <div
                    className="flex"
                    style={{ alignItems: "center", margin: `1em 0` }}
                  >
                    <div style={{ display: "grid" }}>
                      <input
                        name="bad_includeinfindadermatologist"
                        checked={formData.bad_includeinfindadermatologist}
                        onChange={handleInputChange}
                        type="checkbox"
                        className="form-check-input check-box"
                      />
                    </div>
                    <div style={styles.textInfo}>
                      I would like to be included in the Find a Dermatologist
                      directory
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: `1em` }}>
                  Practice address to show in the directory
                </div>
                <div>
                  <div className="flex-col">
                    <input
                      name="address3_line1"
                      value={formData.address3_line1}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Address Line 1"
                      className="form-control"
                      style={styles.input}
                    />
                    <input
                      name="address3_line2"
                      value={formData.address3_line2}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Address Line 2"
                      className="form-control"
                      style={styles.input}
                    />

                    <input
                      name="address3_postalcode"
                      value={formData.address3_postalcode}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Postcode"
                      className="form-control"
                      style={styles.input}
                    />
                    <input
                      name="address3_city"
                      value={formData.address3_city}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="City"
                      className="form-control"
                      style={styles.input}
                    />

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
                </div>
              </div>

              <ProfileAvatar isPreview={formData.bad_profile_photo_url} />
            </div>

            <div style={{ paddingTop: `1em` }}>URLs:</div>
            <input
              name="bad_mainhosptialweb"
              value={formData.bad_mainhosptialweb}
              onChange={handleInputChange}
              type="text"
              placeholder="Main Place of Work"
              className="form-control"
              style={styles.input}
            />
            <input
              name="bad_web1"
              value={formData.bad_web1}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
            />
            <input
              name="bad_web2"
              value={formData.bad_web2}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
            />
            <input
              name="bad_web3"
              value={formData.bad_web3}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
            />

            <div style={{ paddingTop: `1em` }}>About Text</div>
            <div>
              <div className="flex-col">
                <textarea
                  name="bad_findadermatologisttext"
                  value={formData.bad_findadermatologisttext}
                  onChange={handleInputChange}
                  rows="10"
                  type="text"
                  placeholder="Find a Dermatologist About Text"
                  className="form-control"
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex"
          style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
        >
          <div className="blue-btn" onClick={handleProfileUpdate}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  input: {
    borderRadius: 10,
    margin: `0.5em 0`,
  },
  textInfo: {
    paddingLeft: `0.5em`,
  },
};
export default connect(FindDermatologistOptions);
