import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import SearchDropDown from "../../components/searchDropDown";
import ActionPlaceholder from "../actionPlaceholder";
import { colors } from "../../config/imports";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

// DATA HELPERS -----------------------------------------------------------
import { prefMailingOption } from "../../config/data";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
  setErrorAction,
  muiQuery,
  getCountryList,
  googleAutocomplete,
} from "../../context";

const UpdateAddress = ({ state, actions, libraries }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { isActiveUser, countryList } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [addressData, setAddressData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const address1Line1Ref = useRef("");
  const ctaHeight = 40;

  const [isFetching, setIsFetching] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(null);
  const [formData, setFormData] = useState({
    emailaddress1: "",
    mobilephone: "",
    address2_line1: "",
    address2_line2: "",
    address2_city: "",
    address2_country: "",
    address2_postalcode: "",
    _bad_preferredmailingaddress: "", // TBC field name
  });

  useEffect(async () => {
    if (!isActiveUser) return null;

    // map through user & update formData with values
    const handleSetData = ({ name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: isActiveUser[`${name}`] || "",
      }));
    };

    // 📌 get gender list from Dynamics
    if (!countryList) await getCountryList({ state, dispatch });

    // populate profile information form Dynamics records
    if (isActiveUser.address2_line1) handleSetData({ name: "address2_line1" });
    if (isActiveUser.address2_line2) handleSetData({ name: "address2_line2" });
    if (isActiveUser.emailaddress1) handleSetData({ name: "emailaddress1" });
    if (isActiveUser.mobilephone) handleSetData({ name: "mobilephone" });
    if (isActiveUser.address2_city) handleSetData({ name: "address2_city" });
    if (isActiveUser.address2_country)
      handleSetData({ name: "address2_country" });
    if (isActiveUser.address2_postalcode)
      handleSetData({ name: "address2_postalcode" });
    if (isActiveUser._bad_preferredmailingaddress)
      handleSetData({ name: "_bad_preferredmailingaddress" });
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressUpdate = async () => {
    let address2_line1 = formData.address2_line1;
    if (!address2_line1) address2_line1 = address1Line1Ref.current.value; //defaults to input ref value
    const address2_line2 = formData.address2_line2;
    const emailaddress1 = formData.emailaddress1;
    const mobilephone = formData.mobilephone;
    const address2_city = formData.address2_city;
    const address2_country = formData.address2_country;
    const address2_postalcode = formData.address2_postalcode;
    const bad_preferredmailingaddress = formData._bad_preferredmailingaddress;

    const data = Object.assign(
      {}, // add empty object
      { address2_line1 },
      { address2_line2 },
      { emailaddress1 },
      { mobilephone },
      !!address2_city && { address2_city },
      !!address2_country && { address2_country },
      { address2_postalcode },
      !!bad_preferredmailingaddress && { bad_preferredmailingaddress }
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
        isError: { message: `Contact details updated successfully` },
      });
    } catch (error) {
      // console.log("error", error);

      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update contact details. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

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
      address2_line1: title,
      address2_country: countryCode,
      address2_city: cityName,
    }));
  };

  const handleClearAction = () => {
    // clear search input value
    setFormData((prevFormData) => ({
      ...prevFormData,
      address2_line1: "",
    }));
    setSearchInput("");
    setAddressData(null);
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: !lg ? "flex-end" : "center",
          padding: `2em 0 0`,
        }}
      >
        <div className="blue-btn" onClick={handleAddressUpdate}>
          Save
        </div>
      </div>
    );
  };

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

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div className="shadow" style={{ marginBottom: `${marginVertical}px` }}>
        <div style={{ padding: !lg ? `2em 4em` : `1em` }}>
          <div className="primary-title" style={{ fontSize: 20 }}>
            Contact Details:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: !lg ? `1fr 1fr` : `1fr`,
              gap: 20,
              padding: `1em 0 0`,
            }}
          >
            <div>
              <div style={{ position: "relative" }}>
                <label>Home Address Line 1</label>
                {!formData.address2_line1 && (
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
                        placeholder="Home Address Line 1"
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
                    />
                  </div>
                )}
                {formData.address2_line1 && (
                  <div className="form-control input">
                    <div className="flex-row">
                      <div
                        style={{
                          position: "relative",
                          width: "fit-content",
                          paddingRight: 15,
                        }}
                      >
                        {formData.address2_line1}
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

              <div style={styles.wrapper}>
                <label>Home Address Line 2</label>
                <input
                  name="address2_line2"
                  value={formData.address2_line2}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Home Address Line 2"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  name="emailaddress1"
                  type="text"
                  value={formData.emailaddress1}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Email"
                  disabled
                />
              </div>
              <div>
                <label>Mobile Number</label>
                <input
                  name="mobilephone"
                  value={formData.mobilephone}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Postcode"
                />
              </div>
            </div>

            <div>
              <div>
                <label>City</label>
                <input
                  name="address2_city"
                  value={formData.address2_city}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="City"
                />
              </div>

              {countryList && (
                <div style={styles.wrapper}>
                  <label>Country</label>
                  <Form.Select
                    name="address2_country"
                    value={formData.address2_country}
                    onChange={handleInputChange}
                    className="input"
                    // disabled
                  >
                    <option value="" hidden>
                      Country/State
                    </option>
                    {countryList.map((item, key) => {
                      return (
                        <option key={key} value={item.core_name}>
                          {item.core_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
              )}

              <div>
                <label>Postcode</label>
                <input
                  name="address2_postalcode"
                  value={formData.address2_postalcode}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Postcode"
                />
              </div>
              <div style={styles.wrapper}>
                <label>Preferred mailing option</label>
                <Form.Select
                  name="_bad_preferredmailingaddress"
                  value={formData._bad_preferredmailingaddress}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="" hidden>
                    Preferred mailing option
                  </option>
                  {prefMailingOption.map((item, key) => {
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
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default connect(UpdateAddress);
