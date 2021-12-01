import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";

const Form = ({ state, actions }) => {
  // RETURN ---------------------------------------------
  return (
    <form>
      <div style={styles.formContainer}>
        <div className="flex-col">
          <label className="form-label">Your First Name*</label>
          <input type="text" className="form-control" />
        </div>
        <div className="flex-col">
          <label className="form-label">Your Contact E-mail Address</label>
          <input type="email" className="form-control" />
        </div>

        <div className="flex-col">
          <label className="form-label">Your Last Name*</label>
          <input type="text" className="form-control" />
        </div>
        <div className="flex-col">
          <label className="form-label">Confirm Contact E-mail Address</label>
          <input type="email" className="form-control" />
        </div>
      </div>

      <div
        style={{
          ...styles.formContainer,
          borderTop: `1px solid ${colors.darkSilver}`,
          borderBottom: `1px solid ${colors.darkSilver}`,
          padding: `2em 0`,
        }}
      >
        <div className="flex-col">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="flex-col">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-control" />
        </div>
      </div>

      <div className="flex mb-3 form-check">
        <div className="flex">
          <div>
            <input
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label">
              I Agree with the{" "}
              <span
                style={styles.TC}
                onClick={actions.context.setCreateAccountAction}
              >
                Terms & Conditions
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex mb-3 form-check">
        <div className="flex">
          <div>
            <input
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>
          <div>
            <label className="form-check-label">
              I Agree with the{" "}
              <span
                style={styles.TC}
                onClick={actions.context.setCreateAccountAction}
              >
                Marketing
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

const styles = {
  formContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
    margin: `2em 0 2em 0`,
  },
  TC: {
    textDecoration: "underline",
    textUnderlineOffset: 5,
    cursor: "pointer",
  },
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    margin: `0 10px 0 0`,
  },
};

export default connect(Form);
