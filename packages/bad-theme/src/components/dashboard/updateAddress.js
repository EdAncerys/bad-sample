import { useState, useEffect } from "react";
import { connect } from "frontity";

import ActionPlaceholder from "../actionPlaceholder";
import { UK_COUNTIES } from "../../config/data";
import { UK_COUNTRIES } from "../../config/data";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateAddressAction,
} from "../../context";

const UpdateAddress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isFetching, isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleAddressUpdate = () => {
    const address2_line1 = document.querySelector("#addressLineOne").value;
    const address2_line2 = document.querySelector("#addressLineTwo").value;
    const address2_city = document.querySelector("#city").value;
    const address2_country = document.querySelector("#country").value;
    const address2_postalcode = document.querySelector("#postcode").value;

    const data = Object.assign(
      {}, // add empty object
      !!address2_line1 && { address2_line1 },
      !!address2_line2 && { address2_line2 },
      !!address2_city && { address2_city },
      !!address2_country && { address2_country },
      !!address2_postalcode && { address2_postalcode }
    );

    updateAddressAction({ state, dispatch, data, isActiveUser });
    console.log("updateAddress", data);
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
          Update
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{ position: "relative", marginBottom: `${marginVertical}px` }}
    >
      <ActionPlaceholder isFetching={isFetching} />
      <div style={{ padding: `2em 4em` }}>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Address Details:
        </div>
        <ServeForm />
        <ServeActions />
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
