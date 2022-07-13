import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import ProfileAvatar from "./profileAvatar";
import ActionPlaceholder from "../actionPlaceholder";
import SearchDropDown from "../searchDropDown";
import { colors } from "../../config/imports";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  setErrorAction,
  useAppDispatch,
  muiQuery,
  sendFileToS3Action,
  updateProfileAction,
  googleAutocomplete,
  getFadPermision,
  errorMessage,
} from "../../context";

const FindDermatologistOptions = ({ state }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [fadPermision, setFadPermision] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [formData, setFormData] = useState({
    bad_includeinfindadermatologist: false,
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
  const address1Line1Ref = useRef("");
  const ctaHeight = 40;

  useEffect(async () => {
    if (!isActiveUser) return null;

    // map through user & update formData with values
    const handleSetData = ({ name, value }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: value,
      }));
    };

    // 📌 populate profile information form Dynamics records
    handleSetData({
      name: "bad_includeinfindadermatologist",
      value: isActiveUser.bad_includeinfindadermatologist,
    });
    handleSetData({
      name: "address3_line1",
      value: isActiveUser.address3_line1 || "",
    });
    handleSetData({
      name: "address3_line2",
      value: isActiveUser.address3_line2 || "",
    });
    handleSetData({
      name: "address3_postalcode",
      value: isActiveUser.address3_postalcode || "",
    });
    handleSetData({
      name: "address3_city",
      value: isActiveUser.address3_city || "",
    });
    handleSetData({
      name: "bad_mainhosptialweb",
      value: isActiveUser.bad_mainhosptialweb || "",
    });
    handleSetData({ name: "bad_web1", value: isActiveUser.bad_web1 || "" });
    handleSetData({ name: "bad_web2", value: isActiveUser.bad_web2 || "" });
    handleSetData({ name: "bad_web3", value: isActiveUser.bad_web3 || "" });
    handleSetData({
      name: "bad_findadermatologisttext",
      value: isActiveUser.bad_findadermatologisttext || "",
    });
    handleSetData({
      name: "bad_profile_photo_url",
      value: isActiveUser.bad_profile_photo_url || "",
    });

    // 📌 get fad dir permision & check user permission status
    const permision = await getFadPermision({
      state,
      contactid: isActiveUser.contactid,
    });

    // 📌 TESTING ONLY - REMOVE LATER
    setFadPermision(true);
    // if (permision) setFadPermision(permision);
  }, [isActiveUser, dynamicsApps]);

  // HELPERS ----------------------------------------------------------------
  const handleAddressLookup = async () => {
    const input = address1Line1Ref.current.value;
    // update input value before async task
    setFormData((prevFormData) => ({
      ...prevFormData,
      address3_line1: input,
    }));

    try {
      setIsFetchingAddress(true);
      const data = await googleAutocomplete({ input });

      // check for data returned form API
      if (data.length > 0) {
        // covert data to address format
        const dropDownFoprmat = [];
        data.map((item) => {
          dropDownFoprmat.push({ title: item.description, terms: item.terms });
        });

        setAddressData(dropDownFoprmat);
      } else {
        setAddressData(null);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSelectAddress = async ({ item }) => {
    // destructure item object & get coutry code & city name from terms
    const { terms, title } = item;
    let countryCode = "";
    let cityName = "";

    if (terms) {
      // if terms define address components
      if (terms.length >= 1) countryCode = terms[terms.length - 1].value;
      if (terms.length >= 2) cityName = terms[terms.length - 2].value;
    }
    // overwrite formData to match Dynamics fields
    if (countryCode === "UK")
      countryCode = "United Kingdom of Great Britain and Northern Ireland";

    // update formData with values
    setFormData((prevFormData) => ({
      ...prevFormData,
      address3_line1: title,
      address3_city: cityName,
    }));

    // clear response data
    setAddressData(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileUpdate = async () => {
    // 📌 add valid data to data object to be sent to Dynamics
    // not to overwrite existing data in Dynamics only valid inputs are sent
    const data = {
      bad_includeinfindadermatologist: formData.bad_includeinfindadermatologist,
      address3_line1: formData.address3_line1,
      address3_line2: formData.address3_line2,
      address3_postalcode: formData.address3_postalcode,
      address3_city: formData.address3_city,
      bad_mainhosptialweb: formData.bad_mainhosptialweb,
      bad_web1: formData.bad_web1,
      bad_web2: formData.bad_web2,
      bad_web3: formData.bad_web3,
      bad_findadermatologisttext: formData.bad_findadermatologisttext,
      // --------------------------------------------------------------------------------
      bad_profile_photo_url: formData.bad_profile_photo_url,
    };

    // regex to check if postcode is valid for UK
    const regex = /^([A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}|GIR 0AA)$/i;
    let isPostcode = regex.test(data.address3_postalcode);
    if (!isPostcode) {
      data.address3_postalcode = "";

      setFormData((prevFormData) => ({
        ...prevFormData,
        address3_postalcode: "",
      }));
    }

    // check manditory fields are filled
    if (data.address3_postalcode === "" || data.address3_line1 === "") {
      // erorr message if manditory fields are not filled
      let message = "Postcode is mandatory. Please enter a valid postcode.";
      if (data.address3_line1 === "")
        message = "Address is mandatory. Please enter a valid address.";
      if (data.address3_postalcode === "" && data.address3_line1 === "")
        message = "Please fill in all mandatory fields";

      // 📌 add show error message to required formData fields
      if (data.address3_postalcode === "")
        errorMessage({ id: "address3_postalcode" });
      if (data.address3_line1 === "") errorMessage({ id: "address3_line1" });

      setErrorAction({
        dispatch,
        isError: {
          message,
          image: "Error",
        },
      });

      return;
    }

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
        isError: {
          message: `Find a Dermatologist information updated successfully`,
        },
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

  const handleDocUploadChange = async (e) => {
    let bad_profile_photo_url = e.target.files[0];

    if (bad_profile_photo_url)
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: bad_profile_photo_url,
      });

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["bad_profile_photo_url"]: bad_profile_photo_url, // update formData
    }));
  };

  const handleClearAction = () => {
    // clear search input value
    setFormData((prevFormData) => ({
      ...prevFormData,
      address3_line1: "",
    }));
    setAddressData(null);
  };

  // SERVERS ---------------------------------------------------------------
  const ServeIcon = () => {
    const icon = formData.address3_line1 ? <CloseIcon /> : <SearchIcon />;

    if (isFetchingAddress)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={handleClearAction}>{icon}</div>;
  };

  // 📌 hide component if user is not a member
  if (!fadPermision) return null;

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
                    <div className="flex-col relative">
                      <div className="relative">
                        <input
                          ref={address1Line1Ref}
                          name="search-input"
                          value={formData.address3_line1}
                          onChange={handleAddressLookup}
                          type="text"
                          style={{ margin: "0.5em 0", paddingRight: 40 }}
                          className="form-control"
                          placeholder="Address Line 1 (required)"
                          maxLength={state.theme.inputFieldLimit250}
                        />
                        <div
                          className="input-group-text toggle-icon-color"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: 8,
                            height: ctaHeight,
                            border: "none",
                            background: "transparent",
                            alignItems: "center",
                            color: colors.darkSilver,
                            cursor: "pointer",
                          }}
                        >
                          <ServeIcon />
                        </div>
                      </div>
                      <SearchDropDown
                        filter={addressData}
                        onClickHandler={handleSelectAddress}
                        height={250}
                        marginTop={90}
                      />
                      <label className="required-input form-label" />
                      <div
                        id="address3_line1"
                        className="required d-none error-message"
                      />
                    </div>
                    <div className="relative">
                      <input
                        name="address3_line2"
                        value={formData.address3_line2}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Address Line 2"
                        className="form-control"
                        style={styles.input}
                        maxLength={state.theme.inputFieldLimit100}
                      />
                    </div>

                    <div className="relative">
                      <input
                        name="address3_postalcode"
                        value={formData.address3_postalcode}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Postcode (required)"
                        className="form-control"
                        style={styles.input}
                        maxLength={state.theme.inputFieldLimit80}
                      />
                      <label className="required-input form-label" />
                      <div
                        id="address3_postalcode"
                        className="required d-none error-message"
                      />
                    </div>
                    <div className="relative">
                      <input
                        name="address3_city"
                        value={formData.address3_city}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="City"
                        className="form-control"
                        style={styles.input}
                        maxLength={state.theme.inputFieldLimit100}
                      />
                    </div>

                    <div className="relative">
                      <label>Upload A Profile Photo</label>
                      <input
                        ref={documentRef}
                        onChange={handleDocUploadChange}
                        type="file"
                        className="form-control input"
                        style={{ margin: "0.5em 0" }}
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
              maxLength={state.theme.inputFieldLimit100}
            />
            <input
              name="bad_web1"
              value={formData.bad_web1}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
              maxLength={state.theme.inputFieldLimit100}
            />
            <input
              name="bad_web2"
              value={formData.bad_web2}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
              maxLength={state.theme.inputFieldLimit100}
            />
            <input
              name="bad_web3"
              value={formData.bad_web3}
              onChange={handleInputChange}
              type="text"
              placeholder="https://"
              className="form-control"
              style={styles.input}
              maxLength={state.theme.inputFieldLimit100}
            />

            <div style={{ paddingTop: `1em` }}>About Text</div>
            <div>
              <div className="flex-col">
                <textarea
                  name="bad_findadermatologisttext"
                  value={formData.bad_findadermatologisttext}
                  onChange={handleInputChange}
                  rows="8"
                  type="text"
                  placeholder="Find a Dermatologist About Text"
                  className="form-control"
                  style={styles.input}
                  maxLength={state.theme.textAreaLimit}
                />
                <div
                  className="flex"
                  style={{
                    alignSelf: "end",
                    fontSize: 17,
                    fontWeight: "bold",
                    opacity: 0.5,
                  }}
                >
                  {Number(state.theme.textAreaLimit) -
                    formData.bad_findadermatologisttext.length}{" "}
                  characters remaining.
                </div>
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
