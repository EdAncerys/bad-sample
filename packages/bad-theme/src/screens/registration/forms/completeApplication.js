import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { ETHNIC_GROUPES } from "../../../config/data";
import { colors } from "../../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  setGoToAction,
  setCompleteUserApplicationAction,
  validateMembershipFormAction,
} from "../../../context";

const CompleteApplication = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const [formData, setFormData] = useState({
    bad_ethnicity: "",
    py3_constitutionagreement: "",
    privacyNotice: "",
  });

  const [inputValidator, setInputValidator] = useState({
    bad_ethnicity: true,
    py3_constitutionagreement: true,
    privacyNotice: true,
  });

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    const handleSetData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "bad_ethnicity")
        handleSetData({ data, name: "bad_ethnicity" });
      if (data.name === "py3_constitutionagreement")
        handleSetData({ data, name: "py3_constitutionagreement" });
      if (data.name === "privacyNotice")
        handleSetData({ data, name: "privacyNotice" });
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
  const handleComplete = async () => {
    try {
      await setUserStoreAction({
        state,
        dispatch,
        applicationData,
        isActiveUser,
        membershipApplication: { applicationComplete: true }, // set stepOne to complete
        data: formData,
      });

      await setCompleteUserApplicationAction({
        state,
        isActiveUser,
      });

      let slug = `/dashboard/`;
      if (isActiveUser) setGoToAction({ path: slug, actions });
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `2em 1em 0 1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <div className="blue-btn" onClick={handleComplete}>
          Enter
        </div>
      </div>
    );
  };

  return (
    <div>
      <form>
        <div style={{ padding: `2em 1em` }}>
          {inputValidator.bad_ethnicity && (
            <div>
              <label style={styles.subTitle}>What is your Ethnic Group?</label>
              <Form.Select
                name="bad_ethnicity"
                value={formData.bad_ethnicity}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Ethnic Group
                </option>
                {ETHNIC_GROUPES.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          )}

          <div
            className="flex-col form-check"
            style={{
              padding: `1em 0`,
              marginTop: `2em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            {inputValidator.py3_constitutionagreement && (
              <div
                className="flex"
                style={{ alignItems: "center", padding: `1em 0` }}
              >
                <div>
                  <input
                    name="py3_constitutionagreement"
                    checked={formData.py3_constitutionagreement}
                    onChange={handleInputChange}
                    type="checkbox"
                    className="form-check-input check-box"
                  />
                </div>
                <div>
                  <label className="form-check-label flex-row">
                    <div>I agree to the </div>
                    <div
                      className="caps-btn required"
                      style={{ paddingTop: 6, marginLeft: 10 }}
                    >
                      BAD Constitution
                    </div>
                  </label>
                </div>
              </div>
            )}

            {inputValidator.privacyNotice && (
              <div
                className="flex"
                style={{ alignItems: "center", padding: `1em 0` }}
              >
                <div>
                  <input
                    name="privacyNotice"
                    checked={formData.privacyNotice}
                    onChange={handleInputChange}
                    type="checkbox"
                    className="form-check-input check-box"
                  />
                </div>
                <div>
                  <label className="form-check-label flex-row">
                    <div>
                      <div
                        className="caps-btn required"
                        style={{
                          paddingTop: 6,
                          marginRight: 10,
                          whiteSpace: "nowrap",
                          float: "left",
                        }}
                      >
                        I agree - Privacy Notice
                      </div>
                      <span>
                        I agree - Privacy Notice* - justo donec enim diam
                        vulputate ut pharetra sit. Purus semper eget duis at
                        tellus at. Sed adipiscing diam.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
      <ServeActions />
    </div>
  );
};

const styles = {
  title: {
    fontSize: 20,
  },
};

export default connect(CompleteApplication);
