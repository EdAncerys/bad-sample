import { connect } from "frontity";
import { colors } from "../../config/imports";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setCreateAccountModalAction } from "../../context";

const Form = ({ state, actions }) => {
  const dispatch = useAppDispatch();

  const ServePersonalDetailsForm = () => {
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `2em 0`,
          }}
        >
          <div
            className="form-group"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 1fr)`,
            }}
          >
            <div>
              <label>Password</label>
              <input
                id="password"
                type="text"
                className="form-control"
                placeholder="Password"
                style={styles.input}
              />
            </div>
          </div>

          <div
            className="form-group"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 1fr)`,
            }}
          >
            <div>
              <label>Confirm Password</label>
              <input
                id="confirmPassword"
                type="text"
                className="form-control"
                placeholder="Confirm Password"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServePasswordForm = () => {
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: 20,
            padding: `2em 0`,
          }}
        >
          <div
            className="form-group"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 1fr)`,
              gap: `2em`,
            }}
          >
            <div>
              <label>Your First Name</label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="Your First Name"
                style={styles.input}
              />
            </div>
            <div>
              <label>Your Last Name</label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Your Last Name"
                style={styles.input}
              />
            </div>
          </div>

          <div
            className="form-group"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 1fr)`,
              gap: `2em`,
            }}
          >
            <div>
              <label>Your Contact E-mail Address</label>
              <input
                id="emailAddress"
                type="text"
                className="form-control"
                placeholder="Your Contact E-mail Address"
                style={styles.input}
              />
            </div>
            <div>
              <label>Confirm Contact E-mail Address</label>
              <input
                id="confirmEmailAddress"
                type="text"
                className="form-control"
                placeholder="Confirm Contact E-mail Address"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeDivider = () => {
    return (
      <div
        className="flex"
        style={{
          borderBottom: `1px solid ${colors.darkSilver}`,
          margin: `1em 0`,
        }}
      />
    );
  };

  const ServeAgreements = () => {
    return (
      <div className="flex">
        <div className="flex-col">
          <div className="flex-row" style={styles.wrapper}>
            <input
              id="agreeTermsAndConditions"
              type="checkbox"
              className="form-check-input check-box"
            />
            <div style={styles.textInfo}>
              I Agree with the{" "}
              <span style={styles.tcAgreement}>Terms & Conditions</span>
            </div>
          </div>
          <div className="flex-row" style={styles.wrapper}>
            <input
              id="agreeMarketing"
              type="checkbox"
              className="form-check-input check-box"
            />
            <div style={styles.textInfo}>
              I Agree with the <span style={styles.tcAgreement}>Marketing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServePersonalDetailsForm />
      <ServeDivider />
      <ServePasswordForm />
      <ServeDivider />
      <ServeAgreements />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
  tcAgreement: {
    boxShadow: `inset 0 -2px ${colors.darkSilver}`,
    cursor: "pointer",
  },
  textInfo: {
    textInfo: 12,
  },
  wrapper: {
    paddingTop: `1em`,
  },
};

export default connect(Form);
