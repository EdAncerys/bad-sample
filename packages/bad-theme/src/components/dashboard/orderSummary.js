import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { Form } from "react-bootstrap";

import { UK_COUNTIES } from "../../config/data";
import { UK_COUNTRIES } from "../../config/data";

const OrderSummary = ({ state, actions, libraries, setPage }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleProfileUpdate = () => {
    const addressType = document.querySelector("#addressType").value;
    const addressLineOne = document.querySelector("#addressLineOne").value;
    const addressLineTwo = document.querySelector("#addressLineTwo").value;
    const addressLineThree = document.querySelector("#addressLineThree").value;
    const town = document.querySelector("#town").value;
    const mobileNumber = document.querySelector("#mobileNumber").value;

    const county = document.querySelector("#county").value;
    const postcode = document.querySelector("#postcode").value;
    const country = document.querySelector("#country").value;

    const orderSummary = {
      addressType,
      addressLineOne,
      addressLineTwo,
      addressLineThree,
      town,
      mobileNumber,
      county,
      postcode,
      country,
    };
    console.log("orderSummary", orderSummary);
  };

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setPage({ page: "billing" });
  };

  // SERVERS ---------------------------------------------
  const ServeOrderSummary = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr`,
          gridTemplateRows: `repeat(3, 80px)`,
          gap: `5px 20px`,
          paddingTop: `2em`,
          width: `50%`,
        }}
      >
        <div>
          <label>Subscription</label>
          <div style={styles.summary}>2022 - BAD - Associate Trainee</div>
        </div>
        <div>
          <label>Outstanding</label>
          <div style={styles.summary}>£65.00</div>
        </div>
        <div>
          <label>Total Amount</label>
          <div style={styles.summary}>£65.00</div>
        </div>
      </div>
    );
  };

  const ServeBillingAddress = () => {
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gridTemplateRows: `repeat(1, 70px)`,
            gap: `5px 20px`,
            paddingTop: `2em`,
          }}
        >
          <div>
            <label>Address Type</label>
            <Form.Select
              id="addressType"
              style={{ ...styles.input, width: "100%" }}
            >
              <option value="null" disabled hidden>
                Home Address
              </option>
              <option value="1">Home Address</option>
              <option value="2">Home Address</option>
              <option value="3">Home Address</option>
            </Form.Select>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: `5px 20px`,
            paddingTop: `1em`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr`,
              gridTemplateRows: `repeat(5, 70px)`,
              gap: `20px`,
              paddingTop: `1em`,
            }}
          >
            <div>
              <label>Address Line 1</label>
              <input
                id="addressLineOne"
                type="text"
                className="form-control"
                placeholder="Address Line 1"
                style={styles.input}
              />
            </div>
            <div>
              <label>Address Line 2</label>
              <input
                id="addressLineTwo"
                type="text"
                className="form-control"
                placeholder="Address Line 2"
                style={styles.input}
              />
            </div>
            <div>
              <label>Address Line 3</label>
              <input
                id="addressLineThree"
                type="text"
                className="form-control"
                placeholder="Address Line 3"
                style={styles.input}
              />
            </div>
            <div>
              <label>Town/City</label>
              <input
                id="town"
                type="text"
                className="form-control"
                placeholder="Town/City"
                style={styles.input}
              />
            </div>
            <div>
              <label>Mobile Number</label>
              <input
                id="mobileNumber"
                type="number"
                className="form-control"
                placeholder="Mobile Number"
                style={styles.input}
              />
            </div>
          </div>

          <div
            className="form-group"
            style={{
              display: "grid",
              gridTemplateColumns: `1fr`,
              gridTemplateRows: `repeat(5, 70px)`,
              gap: `20px`,
              paddingTop: `1em`,
            }}
          >
            <div>
              <label>County/State</label>
              <Form.Select
                id="county"
                style={{ ...styles.input, width: "100%" }}
              >
                <option value="null" disabled hidden>
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
            <div>
              <label>Postcode</label>
              <input
                id="postcode"
                type="text"
                className="form-control"
                placeholder="Postcode"
                style={styles.input}
              />
            </div>
            <div>
              <label>Country/State</label>
              <Form.Select
                id="country"
                style={{ ...styles.input, width: "100%" }}
              >
                <option value="null" disabled hidden>
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
          style={{ marginRight: `2em` }}
          onClick={handlePayment}
        >
          Cancel
        </div>
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Order Summary:
      </div>
      <ServeOrderSummary />

      <div
        className="flex"
        style={{
          alignItems: "center",
          borderBottom: `1px solid ${colors.darkSilver}`,
          paddingTop: `2em`,
          marginBottom: `2em`,
        }}
      />

      <div className="primary-title" style={{ fontSize: 20 }}>
        Billing Address:
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
    border: `1px solid ${colors.silver}`,
    borderRadius: 10,
    padding: `0.375rem 0.75rem`,
    margin: `10px 0`,
  },
};

export default connect(OrderSummary);
