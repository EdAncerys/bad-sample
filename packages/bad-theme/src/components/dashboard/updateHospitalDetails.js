import { useState, useEffect } from "react";
import { connect } from "frontity";
import ActionPlaceholder from "../actionPlaceholder";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
  setEnquireAction,
  setErrorAction,
} from "../../context";

const UpdateHospitalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    address1_line1: "",
    bad_gmcno: "",
    bad_ntnno: "",
    bad_otherregulatorybodyreference: "",
    jobtitle: "",
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
    if (isActiveUser.address1_line1) handleSetData({ name: "address1_line1" });
    if (isActiveUser.bad_gmcno) handleSetData({ name: "bad_gmcno" });
    if (isActiveUser.bad_ntnno) handleSetData({ name: "bad_ntnno" });
    if (isActiveUser.bad_otherregulatorybodyreference)
      handleSetData({ name: "bad_otherregulatorybodyreference" });
    if (isActiveUser.jobtitle) handleSetData({ name: "jobtitle" });
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // console.log(value); // debug
  };

  const handleContactForm = async () => {
    await setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: "membership@bad.org.uk",
        // contact_public_phone_number: "+1 (123) 456-7890",
        form_title: "Edit Professional Details",
        form_body: `Please use the form below to update us to changes to your professional details. To update your place of work, start typing to select from a list of options. If your place of work is not on the list, type Not Listed and use the message box at the bottom of the form instead`,
        job_title: true,
        message: true,
        recipients: state.contactList.defaultContactList,
        isHospitalChange: true,
      },
    });
  };

  const handleProfileUpdate = async () => {
    // console.log("formData", formData); // debug

    setIsFetching(true);
    // const address1_line1 = formData.address1_line1;
    const bad_gmcno = formData.bad_gmcno;
    const bad_ntnno = formData.bad_ntnno;
    const bad_otherregulatorybodyreference =
      formData.bad_otherregulatorybodyreference;

    const data = Object.assign(
      {}, // add empty object
      // !!address1_line1 && { address1_line1 },
      !!bad_gmcno && { bad_gmcno },
      !!bad_ntnno && { bad_ntnno },
      !!bad_otherregulatorybodyreference && { bad_otherregulatorybodyreference }
    );

    try {
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
        isError: { message: `Professional information updated successfully` },
      });
    } catch (error) {
      console.log("error", error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update professional information. Please try again.`,
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
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div
          type="submit"
          className="blue-btn"
          style={{ marginRight: "1em" }}
          onClick={handleContactForm}
        >
          Request To Edit
        </div>
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
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
          padding: `2em 4em`,
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Professional Information:
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
            <div>
              <label>Job Title</label>
              <input
                name="jobtitle"
                value={formData.jobtitle}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Job Title"
                disabled
              />
            </div>
          </div>

          <div>
            <div>
              <label>Main Place of work / Medical School</label>
              <input
                name="address1_line1"
                value={formData.address1_line1}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Main Place of work / Medical School"
                disabled
              />
            </div>
            <div style={styles.wrapper}>
              <label>Other regulatory body</label>
              <input
                name="bad_otherregulatorybodyreference"
                value={formData.bad_otherregulatorybodyreference}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Other regulatory body"
              />
            </div>
          </div>
        </div>
        <ServeActions />
      </div>
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
