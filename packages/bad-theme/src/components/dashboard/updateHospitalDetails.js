import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
} from "../../context";

const UpdateHospitalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    py3_currentplaceofwork: "",
    bad_gmcno: "",
    bad_ntnno: "",
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
    if (isActiveUser.py3_currentplaceofwork)
      handleSetData({ name: "py3_currentplaceofwork" });
    if (isActiveUser.bad_gmcno) handleSetData({ name: "bad_gmcno" });
    if (isActiveUser.bad_ntnno) handleSetData({ name: "bad_ntnno" });
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

  const handleContactForm = () => {
    console.log("API contact form");
  };

  const handleProfileUpdate = async () => {
    // console.log("formData", formData); // debug

    setIsFetching(true);
    // const py3_currentplaceofwork = formData.py3_currentplaceofwork;
    const bad_gmcno = formData.bad_gmcno;
    const bad_ntnno = formData.bad_ntnno;

    const data = Object.assign(
      {}, // add empty object
      // !!py3_currentplaceofwork && { py3_currentplaceofwork },
      !!bad_gmcno && { bad_gmcno },
      !!bad_ntnno && { bad_ntnno }
    );
    console.log("data", data); // debug

    try {
      await updateProfileAction({ state, dispatch, data, isActiveUser });
    } catch (error) {
      console.log("error", error);
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
        <div>
          <div>
            <label>GMC / IMC Number</label>
            <input
              name="bad_gmcno"
              value={formData.bad_gmcno}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="GMC / IMC Number"
            />
          </div>
          <div style={styles.wrapper}>
            <label>NTN Number</label>
            <input
              name="bad_ntnno"
              type="text"
              value={formData.bad_ntnno}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="NTN Number"
            />
          </div>
        </div>

        <div>
          <div>
            <label>Main Place of work / Medical School</label>
            <input
              name="py3_currentplaceofwork"
              value={formData.py3_currentplaceofwork}
              onChange={handleInputChange}
              className="form-control input"
              placeholder="Main Place of work / Medical School"
              disabled
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
          className="blue-btn"
          style={{ marginRight: "1em" }}
          onClick={handleProfileUpdate}
        >
          Save
        </div>
        <div type="submit" className="blue-btn" onClick={handleContactForm}>
          Request To Edit
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
        Professional Information:
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
  wrapper: {
    padding: "1em 0",
  },
};

export default connect(UpdateHospitalDetails);
