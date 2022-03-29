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
import {
  UK_COUNTIES,
  UK_COUNTRIES,
  prefMailingOption,
} from "../../config/data";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
  setErrorAction,
  googleAutocompleteAction,
} from "../../context";

const UpdateAddress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [addressData, setAddressData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const address1Line1Ref = useRef("");
  const ctaHeight = 40;

  const [isFetching, setIsFetching] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(null);
  const [formData, setFormData] = useState({
    test_address: "",
    address1_line1: "",
    address1_line2: "",
    emailaddress1: "",
    mobilephone: "",
    address1_city: "",
    address1_country: "",
    address1_postalcode: "",
    preferredcontactmethodcode: "", // TBC field name
  });

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
    if (isActiveUser.address1_line1) handleSetData({ name: "address1_line1" });
    if (isActiveUser.address1_line2) handleSetData({ name: "address1_line2" });
    if (isActiveUser.emailaddress1) handleSetData({ name: "emailaddress1" });
    if (isActiveUser.mobilephone) handleSetData({ name: "mobilephone" });
    if (isActiveUser.address1_city) handleSetData({ name: "address1_city" });
    if (isActiveUser.address1_country)
      handleSetData({ name: "address1_country" });
    if (isActiveUser.address1_postalcode)
      handleSetData({ name: "address1_postalcode" });
    if (isActiveUser.preferredcontactmethodcode)
      handleSetData({ name: "preferredcontactmethodcode" });
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(value); // debug
  };

  const handleAddressUpdate = async () => {
    let address1_line1 = formData.address1_line1;
    if (!address1_line1) address1_line1 = address1Line1Ref.current.value; //defaults to input ref value
    const address1_line2 = formData.address1_line2;
    const emailaddress1 = formData.emailaddress1;
    const mobilephone = formData.mobilephone;
    const address1_city = formData.address1_city;
    const address1_country = formData.address1_country;
    const address1_postalcode = formData.address1_postalcode;
    const preferredcontactmethodcode = formData.preferredcontactmethodcode;

    const data = Object.assign(
      {}, // add empty object
      !!address1_line1 && { address1_line1 },
      !!address1_line2 && { address1_line2 },
      !!emailaddress1 && { emailaddress1 },
      !!mobilephone && { mobilephone },
      !!address1_city && { address1_city },
      !!address1_country && { address1_country },
      !!address1_postalcode && { address1_postalcode },
      !!preferredcontactmethodcode && { preferredcontactmethodcode }
    );

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
      console.log("error", error);

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
      const data = await googleAutocompleteAction({
        state,
        query: input,
      });
      // convert data to dropdown format
      let predictions = [];
      // check for data returned form API
      if (data && data.length) {
        predictions = data.map((item) => ({
          // get city & country from data source
          title: item.description,
        }));

        // set dropdown data
        if (predictions.length && input.length) {
          setAddressData(predictions);
        } else {
          setAddressData(null);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSelectAddress = async ({ item }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address1_line1: item.title,
    }));
  };

  const handleClearAction = () => {
    // clear search input value
    setFormData((prevFormData) => ({
      ...prevFormData,
      address1_line1: "",
    }));
    setSearchInput("");
    setAddressData(null);
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div type="submit" className="blue-btn" onClick={handleAddressUpdate}>
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
        <div style={{ padding: `2em 4em` }}>
          <div className="primary-title" style={{ fontSize: 20 }}>
            Contact Details:
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
              <div style={{ position: "relative" }}>
                <label>Address Line 1</label>
                {!formData.address1_line1 && (
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
                    />
                  </div>
                )}
                {formData.address1_line1 && (
                  <div className="form-control input">
                    <div className="flex-row">
                      <div
                        style={{
                          position: "relative",
                          width: "fit-content",
                          paddingRight: 15,
                        }}
                      >
                        {formData.address1_line1}
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
                <label>Address Line 2</label>
                <input
                  name="address1_line2"
                  value={formData.address1_line2}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Address Line 2"
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
                <Form.Select
                  name="address1_city"
                  value={formData.address1_city}
                  onChange={handleInputChange}
                  className="input"
                  // disabled
                >
                  <option value="" hidden>
                    County/State
                  </option>
                  {UK_COUNTIES.map((item, key) => {
                    return (
                      <option key={key} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
              <div style={styles.wrapper}>
                <label>Country</label>
                <Form.Select
                  name="address1_country"
                  value={formData.address1_country}
                  onChange={handleInputChange}
                  className="input"
                  // disabled
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
              </div>
              <div>
                <label>Postcode</label>
                <input
                  name="address1_postalcode"
                  value={formData.address1_postalcode}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Postcode"
                />
              </div>
              <div style={styles.wrapper}>
                <label>Preferred mailing option</label>
                <Form.Select
                  name="preferredcontactmethodcode"
                  value={formData.preferredcontactmethodcode}
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
