import { useState, useEffect } from "react";
import { connect } from "frontity";
import ActionPlaceholder from "../actionPlaceholder";
import { Form } from "react-bootstrap";
// DATA HELPERS -----------------------------------------------------------
import { prefMailingOption } from "../../config/data";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  muiQuery,
  setErrorAction,
  updateProfileAction,
} from "../../context";

const PrivacyPreferences = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();
  const marginVertical = state.theme.marginVertical;

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    bad_bademailalerts: false,
    bad_badecircular: false,
    bad_bjdalerts: false,
    bad_presidentsbulletin: false,
    contactByPhone: false,
    contactByEmail: false,
    universalyUnsubscribe: false,
    bad_preferredmailingaddress: "",
  });

  useEffect(() => {
    if (!isActiveUser) return null;

    // map through user & update formData with values
    const handleSetData = ({ name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: isActiveUser[`${name}`],
      }));
    };

    // 📌 populate profile information form Dynamics records
    handleSetData({ name: "bad_bademailalerts" });
    handleSetData({ name: "bad_badecircular" });
    handleSetData({ name: "bad_bjdalerts" });
    handleSetData({ name: "bad_presidentsbulletin" });
    handleSetData({ name: "bad_preferredmailingaddress" });
    if (
      (isActiveUser.preferredcontactmethodcode &&
        isActiveUser.preferredcontactmethodcode === 3) ||
      isActiveUser.preferredcontactmethodcode === 1
    )
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`contactByPhone`]: true,
      }));
    if (
      (isActiveUser.preferredcontactmethodcode &&
        isActiveUser.preferredcontactmethodcode === 2) ||
      isActiveUser.preferredcontactmethodcode === 1
    )
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`contactByEmail`]: true,
      }));
    // 📌 reset universal unsubscribe to false on load
    setFormData((prevFormData) => ({
      ...prevFormData,
      [`universalyUnsubscribe`]: false,
    }));
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileUpdate = async () => {
    let bad_bademailalerts = formData.bad_bademailalerts;
    let bad_badecircular = formData.bad_badecircular;
    let bad_bjdalerts = formData.bad_bjdalerts;
    let bad_presidentsbulletin = formData.bad_presidentsbulletin;
    let bad_preferredmailingaddress = formData.bad_preferredmailingaddress;
    let contactByPhone = formData.contactByPhone;
    let contactByEmail = formData.contactByEmail;
    let universalyUnsubscribe = formData.universalyUnsubscribe;

    let preferredcontactmethodcode = null;
    // 📌 apply contact method logic
    if (contactByPhone) preferredcontactmethodcode = 3;
    if (contactByEmail) preferredcontactmethodcode = 2;
    if (contactByEmail && contactByPhone) preferredcontactmethodcode = 1;
    // 📌 apply unsubscribe logic
    if (universalyUnsubscribe) {
      bad_bademailalerts = false;
      bad_badecircular = false;
      bad_bjdalerts = false;
      bad_presidentsbulletin = false;
    }

    const data = {
      bad_bademailalerts,
      bad_badecircular,
      bad_bjdalerts,
      bad_presidentsbulletin,
      bad_preferredmailingaddress,
      preferredcontactmethodcode,
    };

    try {
      setIsFetching(true);
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
        refreshJWT,
      });
      if (!response) throw new Error("Error updating profile");
      // display error message
      setErrorAction({
        dispatch,
        isError: { message: `Personal information updated successfully` },
      });
    } catch (error) {
      console.log("error", error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update personal information. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: !lg ? "flex-end" : "center",
          paddingTop: `4em`,
        }}
      >
        <div className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="shadow"
        style={{
          padding: !lg ? `2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Privacy and contact preferences:
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: !lg ? `1fr 1fr` : "1fr",
            gap: 20,
            padding: `2em 0 0`,
          }}
        >
          <div className="flex-col">
            <div>I am happy to receive:</div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="bad_bademailalerts"
                  checked={formData.bad_bademailalerts}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>BAD Email Alerts</div>
              </div>
            </div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="bad_badecircular"
                  checked={formData.bad_badecircular}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>BAD e-circular</div>
              </div>
            </div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="bad_bjdalerts"
                  checked={formData.bad_bjdalerts}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>BAD Alerts</div>
              </div>
            </div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="bad_presidentsbulletin"
                  checked={formData.bad_presidentsbulletin}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>President's Bulletin</div>
              </div>
            </div>
          </div>

          <div className="flex-col ">
            {/* <div>I am happy to be contacted by:</div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="contactByPhone"
                  checked={formData.contactByPhone}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>Phone</div>
              </div>
            </div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="contactByEmail"
                  checked={formData.contactByEmail}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>Email</div>
              </div>
            </div> */}

            <div>Universal unsubscribe:</div>
            <div>
              <div className="flex-row" style={styles.wrapper}>
                <input
                  name="universalyUnsubscribe"
                  checked={formData.universalyUnsubscribe}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
                <div style={styles.textInfo}>
                  Choose to universally unsubscribe from all BAD membership mass
                  communications
                </div>
              </div>
            </div>
            <div>
              <div style={{ padding: "1em 0" }}>Preferred mailing option</div>
              <Form.Select
                name="bad_preferredmailingaddress"
                value={formData.bad_preferredmailingaddress}
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
  );
};

const styles = {
  textInfo: {
    fontSize: 12,
    paddingLeft: `1em`,
  },
  wrapper: {
    paddingTop: `1em`,
  },
};

export default connect(PrivacyPreferences);
