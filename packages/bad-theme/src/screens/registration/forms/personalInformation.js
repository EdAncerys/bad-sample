import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import Avatar from "../../../img/svg/profile.svg";
import { colors } from "../../../config/imports";
import FormError from "../../../components/formError";
import SearchDropDown from "../../../components/searchDropDown";
import ActionPlaceholder from "../../../components/actionPlaceholder";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  setGoToAction,
  validateMembershipFormAction,
  errorHandler,
  googleAutocomplete,
  muiQuery,
  getGenderAction,
} from "../../../context";

const PersonalDetails = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps, genderList } =
    useAppState();
  const { lg } = muiQuery();
  const [isFetching, setFetching] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(null);
  const [formData, setFormData] = useState({
    py3_title: "",
    py3_firstname: "",
    py3_lastname: "",
    py3_gender: "",
    py3_dateofbirth: "",
    py3_email: "",
    py3_mobilephone: "",
    py3_address1ine1: "",
    py3_addressline2: "",
    py3_addresstowncity: "",
    py3_addresscountystate: "",
    py3_addresszippostalcode: "",
    py3_addresscountry: "",
    sky_profilepicture: "",
  });
  const [inputValidator, setInputValidator] = useState({
    bad_py3_title: true,
    bad_py3_firstname: true,
    bad_py3_lastname: true,
    bad_py3_gender: true,
    bad_py3_email: true,
    bad_py3_mobilephone: true,
    bad_py3_address1ine1: true,
    bad_py3_addressline2: true,
    bad_py3_addresstowncity: true,
    bad_py3_addresscountystate: true,
    bad_py3_addresszippostalcode: true,
    bad_py3_addresscountry: true,
    bad_sky_profilepicture: true,
    bad_py3_dateofbirth: true,
  });
  const documentRef = useRef(null);

  const [addressData, setAddressData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const address1Line1Ref = useRef("");
  const ctaHeight = 40;

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    const handleSetData = ({ data, name }) => {
      let value = data.value;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: value || "",
      }));
    };

    // 📌 get gender list from Dynamics
    if (!genderList) await getGenderAction({ state, dispatch });

    // add profile picture from CONTEXT
    if (isActiveUser) {
      const { bad_profile_photo_url } = isActiveUser;
      setFormData((prevFormData) => ({
        ...prevFormData,
        sky_profilepicture: bad_profile_photo_url,
      }));
    }

    // console.log("🐞 applicationData", applicationData);
    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "py3_title") handleSetData({ data, name: "py3_title" });
      if (data.name === "py3_firstname")
        handleSetData({ data, name: "py3_firstname" });
      if (data.name === "py3_lastname")
        handleSetData({ data, name: "py3_lastname" });
      if (data.name === "py3_email") handleSetData({ data, name: "py3_email" });
      if (data.name === "py3_mobilephone")
        handleSetData({ data, name: "py3_mobilephone" });
      if (data.name === "py3_address1ine1")
        handleSetData({ data, name: "py3_address1ine1" });
      if (data.name === "py3_addressline2")
        handleSetData({ data, name: "py3_addressline2" });
      if (data.name === "py3_addresstowncity")
        handleSetData({ data, name: "py3_addresstowncity" });
      if (data.name === "py3_addresscountystate")
        handleSetData({ data, name: "py3_addresscountystate" });
      if (data.name === "py3_addresszippostalcode")
        handleSetData({ data, name: "py3_addresszippostalcode" });
      if (data.name === "py3_addresscountry")
        handleSetData({ data, name: "py3_addresscountry" });
      if (data.name === "sky_profilepicture")
        handleSetData({ data, name: "sky_profilepicture" });
      if (data.name === "py3_dateofbirth")
        handleSetData({ data, name: "py3_dateofbirth" });
      if (data.name === "py3_gender")
        handleSetData({ data, name: "py3_gender" });
    });

    // ⏬ validate inputs
    validateMembershipFormAction({
      state,
      actions,
      setData: setInputValidator,
      applicationData,
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleAddressLookup = async () => {
    const input = address1Line1Ref.current.value;
    // update input value before async task
    setSearchInput(input);

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
      py3_address1ine1: title,
      py3_addresscountry: countryCode,
      py3_addresstowncity: cityName,
    }));
  };

  const handleClearAction = () => {
    // clear search input value
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_address1ine1: "",
    }));
    setSearchInput("");
    setAddressData(null);
  };

  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });
    if (isActiveUser) setGoToAction({ state, path: `/membership/`, actions });
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      let inputValue = input;
      // 📌 add bad_ if input dont have it
      if (!inputValue.includes("bad_")) inputValue = `bad_${input}`;

      if (!formData[input] && inputValidator[inputValue]) {
        errorHandler({ id: `form-error-${input}` });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleNext = async () => {
    // default py3_address1ine1 to ref if value not set by user
    let isAddressInput = false;
    if (!formData.py3_address1ine1 && address1Line1Ref.current.value.length) {
      isAddressInput = true;
      formData.py3_address1ine1 = address1Line1Ref.current.value;
    }

    const isValid = isFormValidated({
      required: [
        "py3_title",
        "py3_firstname",
        "py3_lastname",
        "py3_gender",
        "py3_email",
        "py3_mobilephone",
        isAddressInput ? "" : "py3_address1ine1",
        "py3_addresstowncity",
        "py3_addresszippostalcode",
        "py3_addresscountry",
      ],
    });
    if (!isValid) return null;

    setFetching(true);
    const store = await setUserStoreAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      dynamicsApps,
      membershipApplication: { stepThree: true }, // set stepOne to complete
      data: formData,
    });
    setFetching(false);
    if (!store.success) return; // if store not saved, return

    let slug = `/membership/step-4-professional-details/`;
    if (isActiveUser) setGoToAction({ state, path: slug, actions });

    // console.log(formData); // debug
  };

  const handleDocUploadChange = async () => {
    let sky_profilepicture = documentRef.current.files[0];
    // const objectURL = URL.createObjectURL(sky_profilepicture);

    if (sky_profilepicture)
      sky_profilepicture = await sendFileToS3Action({
        state,
        dispatch,
        attachments: sky_profilepicture,
      });

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["sky_profilepicture"]: sky_profilepicture,
    }));
    // console.log("sky_profilepicture", sky_profilepicture); // debug
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SERVERS ---------------------------------------------
  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = searchInput ? closeIcon : searchIcon;

    if (isFetchingAddress)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={handleClearAction}>{icon}</div>;
  };

  const ServeActions = () => {
    return (
      <div
        className={!lg ? "flex" : "flex-col"}
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              state,
              path: `/membership/step-2-category-selection/`,
              actions,
            })
          }
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: !lg ? `0 1em` : "1em 0" }}
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
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: !lg ? `1fr 1fr` : "1fr",
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
              // add border if image set by user
              border: formData.sky_profilepicture
                ? `1px solid ${colors.silver}`
                : "none",
            }}
          >
            <Image
              src={formData.sky_profilepicture || Avatar}
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
            ref={documentRef}
            onChange={handleDocUploadChange}
            type="file"
            className="form-control input"
            placeholder="Profile Photo"
            accept="image/png, image/jpeg"
          />
        </div>

        <form>
          <div style={{ padding: `0 1em 1em` }}>
            {inputValidator.bad_py3_title && (
              <div>
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
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Professor">Professor</option>
                </Form.Select>
                <FormError id="py3_title" />
              </div>
            )}

            {inputValidator.bad_py3_firstname && (
              <div>
                <label className="form-label required">First Name</label>
                <input
                  name="py3_firstname"
                  value={formData.py3_firstname}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="First Name"
                />
                <FormError id="py3_firstname" />
              </div>
            )}

            {inputValidator.bad_py3_lastname && (
              <div>
                <label className="form-label required">Last Name</label>
                <input
                  name="py3_lastname"
                  value={formData.py3_lastname}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Last Name"
                />
                <FormError id="py3_lastname" />
              </div>
            )}

            {inputValidator.bad_py3_gender && genderList && (
              <div>
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
                  {genderList.map((item, key) => {
                    return (
                      <option key={key} value={item.value}>
                        {item.Label}
                      </option>
                    );
                  })}
                </Form.Select>
                <FormError id="py3_gender" />
              </div>
            )}

            {inputValidator.bad_py3_dateofbirth && (
              <div>
                <label className="form-label">Date of Birth</label>
                <input
                  name="py3_dateofbirth"
                  value={formData.py3_dateofbirth}
                  onChange={handleInputChange}
                  type="date"
                  className="form-control input"
                  placeholder="Date of Birth"
                />
              </div>
            )}

            {inputValidator.bad_py3_email && (
              <div>
                <label className="form-label required">Email</label>
                <input
                  name="py3_email"
                  value={formData.py3_email}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Email"
                />
              </div>
            )}

            {inputValidator.bad_py3_mobilephone && (
              <div>
                <label className="form-label required">Mobile Number</label>
                <input
                  name="py3_mobilephone"
                  value={formData.py3_mobilephone}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Mobile Number"
                />
                <FormError id="py3_mobilephone" />
              </div>
            )}
          </div>

          <div
            style={{
              padding: `1em 1em`,
              display: "grid",
              gap: 10,
            }}
          >
            {inputValidator.bad_py3_address1ine1 && (
              <div>
                <label className="required form-label">Home Address</label>

                <div style={{ position: "relative" }}>
                  {!formData.py3_address1ine1 && (
                    <div style={{ position: "relative", width: "100%" }}>
                      <div
                        className="flex"
                        style={{
                          flex: 1,
                          height: ctaHeight,
                          position: "relative",
                          margin: "auto 0",
                        }}
                      >
                        <input
                          ref={address1Line1Ref}
                          name="search-input"
                          value={searchInput}
                          onChange={handleAddressLookup}
                          type="text"
                          className="form-control input"
                          placeholder="Address Line 1"
                        />
                        <div
                          className="input-group-text toggle-icon-color"
                          style={{
                            position: "absolute",
                            right: 0,
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
                      />
                    </div>
                  )}
                  {formData.py3_address1ine1 && (
                    <div className="form-control input">
                      <div className="flex-row">
                        <div
                          style={{
                            position: "relative",
                            width: "fit-content",
                            paddingRight: 15,
                          }}
                        >
                          {formData.py3_address1ine1}
                          <div
                            className="filter-icon"
                            style={{ top: -7 }}
                            onClick={handleClearAction}
                          >
                            <CloseIcon
                              style={{
                                fill: colors.darkSilver,
                                padding: 0,
                                width: "0.7em",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <FormError id="py3_address1ine1" />
              </div>
            )}

            {inputValidator.bad_py3_addressline2 && (
              <input
                name="py3_addressline2"
                value={formData.py3_addressline2}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Address Line 2"
              />
            )}
            {inputValidator.bad_py3_addresstowncity && (
              <div>
                <input
                  name="py3_addresstowncity"
                  value={formData.py3_addresstowncity}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="City"
                />
                <FormError id="py3_addresstowncity" />
              </div>
            )}
            {inputValidator.bad_py3_addresscountystate && (
              <div>
                <input
                  name="py3_addresscountystate"
                  value={formData.py3_addresscountystate}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="County/State"
                />
                <FormError id="py3_addresscountystate" />
              </div>
            )}
            {inputValidator.bad_py3_addresszippostalcode && (
              <div>
                <input
                  name="py3_addresszippostalcode"
                  value={formData.py3_addresszippostalcode}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Postcode/Zip"
                />
                <FormError id="py3_addresszippostalcode" />
              </div>
            )}
            {inputValidator.bad_py3_addresscountry && (
              <div>
                <input
                  name="py3_addresscountry"
                  value={formData.py3_addresscountry}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Country"
                />
                <FormError id="py3_addresscountry" />
              </div>
            )}
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
