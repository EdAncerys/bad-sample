import { useState, useEffect } from "react";
import { connect } from "frontity";

import ActionPlaceholder from "../actionPlaceholder";
import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  sendFileToS3Action,
  updateProfileAction,
} from "../../context";

const UpdateProfile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [isFetching, setIsFetching] = useState(null);

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleProfileUpdate = async () => {
    setIsFetching(true);

    const firstname = document.querySelector("#fistName").value.trim();
    const lastname = document.querySelector("#lastName").value.trim();
    const profilePicture = document.querySelector("#profilePicture").files[0];
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value.toLowerCase().trim();

    let bad_profile_photo_url = "";
    if (!!profilePicture) {
      // API call to S3 to get img url
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: profilePicture,
      });
    }

    const data = Object.assign(
      {}, // add empty object
      !!firstname && { firstname },
      !!lastname && { lastname },
      !!bad_profile_photo_url && { bad_profile_photo_url }
    );

    await updateProfileAction({ state, dispatch, data, isActiveUser });
    setIsFetching(false);
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
          <label>Your First Name</label>
          <input
            id="fistName"
            type="text"
            className="form-control"
            placeholder="Your First Name"
            defaultValue={isActiveUser.firstname}
            style={styles.input}
          />
          <label>Your Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            placeholder="Your Last Name"
            defaultValue={isActiveUser.lastname}
            style={styles.input}
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Your Contact E-mail Address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Your Contact E-mail Address"
            defaultValue={isActiveUser.emailaddress1}
            style={styles.input}
            disabled
          />
          <label>Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Password"
            style={styles.input}
            disabled
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Your Profile Picture</label>
          <input
            id="profilePicture"
            type="file"
            className="form-control"
            style={styles.input}
            accept="image/png, image/jpeg"
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
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
          Save
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
          Personal Details:
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

export default connect(UpdateProfile);
