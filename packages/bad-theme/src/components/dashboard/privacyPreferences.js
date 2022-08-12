import { useState, useEffect } from "react";
import { connect } from "frontity";
import ActionPlaceholder from "../actionPlaceholder";
import { Form } from "react-bootstrap";
import { colors } from "../../config/colors";
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
  const { sm, md, lg, xl } = muiQuery();
  const marginVertical = state.theme.marginVertical;

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps, fad } = useAppState();

  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    _bad_bademailalerts: false,
    _bad_badecircular: false,
    _bad_bjdalerts: false,
    _bad_presidentsbulletin: false,
    _donotemail: false,
    _bad_preferredmailingaddress: false,
  });

  // --------------------------------------------------------------------------------
  const handleSetData = ({ name, value }) => {
    setFormData((prevFormData) => ({
      // --------------------------------------------------------------------------------
      // 📌  NOTE. USER pref settings are in reverse order of the value
      //    ex. _bad_bademailalerts === true ===> "Do Not Allow"
      // --------------------------------------------------------------------------------
      ...prevFormData,
      [`${name}`]: value,
    }));
  };

  useEffect(() => {
    if (!isActiveUser) return null;

    // 📌 populate profile information form Dynamics records
    handleSetData({
      name: "_bad_bademailalerts",
      value:
        isActiveUser[`_bad_bademailalerts`] === null
          ? false
          : !isActiveUser[`_bad_bademailalerts`],
    });
    handleSetData({
      name: "_bad_badecircular",
      value:
        isActiveUser[`_bad_badecircular`] === null
          ? false
          : !isActiveUser[`_bad_badecircular`],
    });
    handleSetData({
      name: "_bad_bjdalerts",
      value:
        isActiveUser[`_bad_bjdalerts`] === null
          ? false
          : !isActiveUser[`_bad_bjdalerts`],
    });
    handleSetData({
      name: "_bad_presidentsbulletin",
      value:
        isActiveUser[`_bad_presidentsbulletin`] === null
          ? false
          : !isActiveUser[`_bad_presidentsbulletin`],
    });
    handleSetData({
      name: "_donotemail",
      // --------------------------------------------------------------------------------
      // 📌  flip to oposite & check if value in !null
      // --------------------------------------------------------------------------------
      value:
        isActiveUser[`_donotemail`] === null
          ? false
          : !isActiveUser[`_donotemail`],
    });
    handleSetData({
      name: "_bad_preferredmailingaddress",
      value: isActiveUser[`_bad_preferredmailingaddress`],
    });
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    // untick checkbox if _donotemail is checked and value is true
    if (name === "_donotemail" && checked === true) {
      handleSetData({ name: "_bad_bademailalerts", value: false });
      handleSetData({ name: "_bad_badecircular", value: false });
      handleSetData({ name: "_bad_bjdalerts", value: false });
      handleSetData({ name: "_bad_presidentsbulletin", value: false });
    }
    // --------------------------------------------------------------------------------
    // if any other checkbox is checked, untick _donotemail
    if (name !== "_donotemail" && checked === true) {
      handleSetData({ name: "_donotemail", value: false });
    }
    // --------------------------------------------------------------------------------
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileUpdate = async () => {
    let data = {
      // --------------------------------------------------------------------------------
      // 📌  NOTE. USER pref settings are in reverse order of the value
      //    ex. _bad_bademailalerts === true ===> "Do Not Allow"
      // --------------------------------------------------------------------------------
      bad_bademailalerts: !formData._bad_bademailalerts,
      bad_badecircular: !formData._bad_badecircular,
      bad_bjdalerts: !formData._bad_bjdalerts,
      bad_presidentsbulletin: !formData._bad_presidentsbulletin,
      donotemail: !formData._donotemail,
      // --------------------------------------------------------------------------------
      bad_preferredmailingaddress: formData._bad_preferredmailingaddress,
    };

    // 📌 if user has checked the universal unsubscribe checkbox, set all other checkboxes to false
    if (formData._donotemail) {
      data = {
        ...data,
        bad_bademailalerts: true,
        bad_badecircular: true,
        bad_bjdalerts: true,
        bad_presidentsbulletin: true,
      };
    }

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
        isError: { message: `Personal information updated successfully` },
      });
    } catch (error) {
      // console.log("error", error);
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

  const handlePreferenceUpdate = async () => {
    if (!isActiveUser) return;
    let directoryPref = "Opt-in";
    if (fad.directoryPref === "Opt-in") directoryPref = "Opt-out";

    directoryPref = !isActiveUser._bad_memberdirectory;

    const data = Object.assign(
      {}, // add empty object
      { bad_memberdirectory: directoryPref }
    );

    try {
      setIsFetching(true);
      // API call to update profile preferences
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
        isError: {
          message: `Members' Directory preferences updated successfully`,
        },
      });
    } catch (error) {
      // console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update members directory preferences. Please try again.`,
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

  const ServeMembersDirAction = () => {
    if (!isActiveUser) return null;
    const { _bad_memberdirectory } = isActiveUser;

    let isBADMember = false;
    // 📌 check if user is a BAD member
    let badApps = dynamicsApps.subs.data.filter((app) => {
      let hasBADMemberships = app.bad_organisedfor === "BAD";

      return hasBADMemberships;
    });
    // 📌 check if user is a BAD member
    if (badApps.length) isBADMember = true;
    // 📌 if member is not active BAD user hide component
    if (!isBADMember) return null;

    return (
      <div className="flex-col">
        <div className="primary-title" style={{ padding: "2em 0 1em 0" }}>
          You can opt-in or opt-out of the Members' Directory here:
        </div>
        <div
          className="blue-btn"
          style={{
            marginRight: "1em",
            width: "fit-content",
            backgroundColor: !_bad_memberdirectory
              ? colors.danger
              : colors.white,
          }}
          onClick={handlePreferenceUpdate}
        >
          {!_bad_memberdirectory ? "Opt-out" : "Opt-in"}
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
            <div className="primary-title">I am happy to receive:</div>
            <div className="flex" style={{ alignItems: "center" }}>
              <div style={{ display: "grid" }}>
                <input
                  name="_bad_bademailalerts"
                  checked={formData._bad_bademailalerts}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
              <div style={styles.textInfo}>BAD Email Alerts</div>
            </div>
            <div className="flex" style={{ alignItems: "center" }}>
              <div style={{ display: "grid" }}>
                <input
                  name="_bad_badecircular"
                  checked={formData._bad_badecircular}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
              <div style={styles.textInfo}>BAD e-circular</div>
            </div>
            <div className="flex" style={{ alignItems: "center" }}>
              <div style={{ display: "grid" }}>
                <input
                  name="_bad_presidentsbulletin"
                  checked={formData._bad_presidentsbulletin}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
              <div style={styles.textInfo}>President's Bulletin</div>
            </div>
            <div className="flex" style={{ alignItems: "center" }}>
              <div style={{ display: "grid" }}>
                <input
                  name="_bad_bjdalerts"
                  checked={formData._bad_bjdalerts}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
              <div style={styles.textInfo}>BJD Alerts</div>
            </div>
          </div>

          <div className="flex-col ">
            <div className="primary-title">Universal unsubscribe:</div>
            <div className="flex" style={{ alignItems: "center" }}>
              <div style={{ display: "grid" }}>
                <input
                  name="_donotemail"
                  checked={formData._donotemail}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
              <div style={styles.textInfo}>
                Choose to universally unsubscribe from all BAD membership mass
                communications
              </div>
            </div>
            <div>
              <div style={{ padding: "1em 0" }}>Preferred mailing option</div>
              <Form.Select
                name="_bad_preferredmailingaddress"
                value={formData._bad_preferredmailingaddress}
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
        <ServeMembersDirAction />
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  textInfo: {
    fontSize: 16,
    paddingLeft: `1em`,
  },
};

export default connect(PrivacyPreferences);
