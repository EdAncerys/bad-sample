import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import ActionPlaceholder from "../actionPlaceholder";
import { UK_COUNTIES, UK_COUNTRIES } from "../../config/data";
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
    address2_line1: "",
    address2_line2: "",
    emailaddress1: "",
    mobilephone: "",
    address1_city: "",
    address1_country: "",
    address1_postalcode: "",
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
    if (isActiveUser.address2_line1) handleSetData({ name: "address2_line1" });
    if (isActiveUser.address2_line2) handleSetData({ name: "address2_line2" });
    if (isActiveUser.emailaddress1) handleSetData({ name: "emailaddress1" });
    if (isActiveUser.mobilephone) handleSetData({ name: "mobilephone" });
    if (isActiveUser.address1_city) handleSetData({ name: "address1_city" });
    if (isActiveUser.address1_country)
      handleSetData({ name: "address1_country" });
    if (isActiveUser.address1_postalcode)
      handleSetData({ name: "address1_postalcode" });
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
    const address2_line1 = formData.address2_line1;
    const address2_line2 = formData.address2_line2;
    const emailaddress1 = formData.emailaddress1;
    const mobilephone = formData.mobilephone;
    const address1_city = formData.address1_city;
    const address1_country = formData.address1_country;
    const address1_postalcode = formData.address1_postalcode;

    const data = Object.assign(
      {}, // add empty object
      !!address2_line1 && { address2_line1 },
      !!address2_line2 && { address2_line2 },
      !!emailaddress1 && { emailaddress1 },
      !!mobilephone && { mobilephone },
      !!address1_city && { address1_city },
      !!address1_country && { address1_country },
      !!address1_postalcode && { address1_postalcode }
    );

    try {
      setIsFetching(true);
      await updateProfileAction({ state, dispatch, data, isActiveUser });

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

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          gap: 20,
          padding: `1em 0 0`,
        }}
      >
        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Address Line 1</label>
          <input
            id="addressLineOne"
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            defaultValue={isActiveUser.address2_line1}
            style={styles.input}
          />
          <label>Address Line 2</label>
          <input
            id="addressLineTwo"
            type="text"
            className="form-control"
            placeholder="Address Line 2"
            defaultValue={isActiveUser.address2_line2}
            style={styles.input}
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>City</label>
          <select name="cars" id="city" style={styles.input}>
            <option>County/State</option>
            {UK_COUNTIES.map((item, key) => {
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </select>

          <label>Country</label>
          <select name="cars" id="country" style={styles.input}>
            <option>County/State</option>
            {UK_COUNTRIES.map((item, key) => {
              return (
                <option key={key} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Postcode</label>
          <input
            id="postcode"
            type="text"
            className="form-control"
            placeholder="Postcode"
            defaultValue={isActiveUser.address2_postalcode}
            style={styles.input}
          />
        </div>
      </div>
    );
  };

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
                  name="address2_line1"
                  value={formData.address2_line1}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Address Line 1"
                />
              </div>
              <div style={styles.wrapper}>
                <label>Address Line 2</label>
                <input
                  name="address2_line2"
                  value={formData.address2_line2}
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
