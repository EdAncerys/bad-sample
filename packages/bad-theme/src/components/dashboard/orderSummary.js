import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { Form } from "react-bootstrap";

const OrderSummary = ({ state, actions, libraries, setPayOrder }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleProfileUpdate = () => {
    const firstName = document.querySelector("#fistName").value;
    const lastName = document.querySelector("#lastName").value;
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value.toLowerCase();

    const updateCredentials = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log("updateCredentials", updateCredentials);
  };

  // SERVERS ---------------------------------------------
  const ServeOrderSummary = () => {
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
          <label>Subscription</label>
          <div style={styles.summary}>2022 - BAD - Associate Trainee</div>
          <label>Outstanding</label>
          <div style={styles.summary}>£65.00</div>
          <label>Total Amount</label>
          <div style={styles.summary}>£65.00</div>
        </div>
      </div>
    );
  };

  const ServeBillingAddress = () => {
    return (
      <div>
        <label>Address Type</label>
        <Form.Select
          id="serveFilterOne"
          style={{ ...styles.input, width: "100%" }}
        >
          <option>Home Address</option>
          <option value="1">Home Address</option>
          <option value="2">Home Address</option>
          <option value="3">Home Address</option>
        </Form.Select>
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
              style={styles.input}
            />
            <label>Address Line 2</label>
            <input
              id="addressLineTwo"
              type="text"
              className="form-control"
              placeholder="Address Line 2"
              style={styles.input}
            />
            <label>Address Line 3</label>
            <input
              id="addressLineThree"
              type="text"
              className="form-control"
              placeholder="Address Line 3"
              style={styles.input}
            />
            <label>Town/City</label>
            <input
              id="town"
              type="text"
              className="form-control"
              placeholder="Town/City"
              style={styles.input}
            />
            <label>Mobile Number</label>
            <input
              id="mobileNumber"
              type="text"
              className="form-control"
              placeholder="Mobile Number"
              style={styles.input}
            />
          </div>

          <div className="form-group" style={{ display: "grid", gap: 10 }}>
            <label>County/State</label>
            <input
              id="state"
              type="text"
              className="form-control"
              placeholder="County/State"
              style={styles.input}
            />
            <label>Postcode</label>
            <input
              id="postcode"
              type="text"
              className="form-control"
              placeholder="Postcode"
              style={styles.input}
            />
            <label>County/State</label>
            <input
              id="country"
              type="text"
              className="form-control"
              placeholder="County/State"
              style={styles.input}
            />
          </div>
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
        <div
          type="submit"
          className="transparent-btn"
          // onClick={() => setPayOrder(null)}
        >
          Cancel
        </div>
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Personal Details:
      </div>
      <ServeOrderSummary />

      <div
        className="flex"
        style={{
          borderBottom: `1px solid ${colors.darkSilver}`,
          margin: `1em 0`,
        }}
      />

      <div className="primary-title" style={{ fontSize: 20 }}>
        Personal Details:
      </div>
      <ServeBillingAddress />

      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
  summary: {
    fontSize: 12,
    color: colors.darkSilver,
    border: `1px solid ${colors.darkSilver}`,
    borderRadius: 10,
    padding: `1em`,
    margin: `10px 0`,
  },
};

export default connect(OrderSummary);
