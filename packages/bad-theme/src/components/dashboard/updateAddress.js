import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import ActionPlaceholder from "../actionPlaceholder";
import {
  UK_COUNTIES,
  UK_COUNTRIES,
  prefMailingOption,
} from "../../config/data";
import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
  setErrorAction,
} from "../../context";

const UpdateAddress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
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
    const address1_line1 = formData.address1_line1;
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

  const onChangeHandler = (e) => {
    console.log(e);
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   test_address: address,
    // }));
  };

  const handleSelect = async (address) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      test_address: address,
    }));
    const results = await geocodeByAddress(address);
    const latLng = await getLatLng(results[0]);
    console.log(latLng);
  };

  const handleChange = (address) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      test_address: address,
    }));
  };

  const handleCloseClick = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      test_address: "",
    }));
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

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div className="shadow" style={{ marginBottom: `${marginVertical}px` }}>
        <div style={{ padding: `2em 4em` }}>
          <div className="primary-title" style={{ fontSize: 20 }}>
            Contact Details:
          </div>

          {/* <PlacesAutocomplete
            // onChange={(e) => onChangeHandler(e)}
            onChange={handleChange}
            value={formData.test_address}
            onSelect={handleSelect}
            // onError={this.handleError}
            // shouldFetchSuggestions={address.length > 2}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
              return (
                <div className="Demo__search-bar-container">
                  <div className="Demo__search-input-container">
                    <input
                      {...getInputProps({
                        placeholder: "Search Places...",
                        className: "Demo__search-input",
                      })}
                    />
                    {formData.test_address.length > 0 && (
                      <button
                        className="Demo__clear-button"
                        onClick={handleCloseClick}
                      >
                        x
                      </button>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="Demo__autocomplete-container">
                      {suggestions.map((suggestion) => {
                        const className = classnames("Demo__suggestion-item", {
                          "Demo__suggestion-item--active": suggestion.active,
                        });

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                            })}
                          >
                            <strong>
                              {suggestion.formattedSuggestion.mainText}
                            </strong>{" "}
                            <small>
                              {suggestion.formattedSuggestion.secondaryText}
                            </small>
                          </div>
                        );
                      })}
                      <div className="Demo__dropdown-footer">
                        <div>x?</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          </PlacesAutocomplete> */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr 1fr`,
              gap: 20,
              padding: `1em 0 0`,
            }}
          >
            <div>
              <div>
                <label>Address Line 1</label>
                <input
                  name="address1_line1"
                  value={formData.address1_line1}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Address Line 1"
                />
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
