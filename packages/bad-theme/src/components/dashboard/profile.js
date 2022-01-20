import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import ProfileAvatar from "../../img/svg/profile.svg";

const Profile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;
  const activeUser = state.context.isActiveUser;

  // SERVERS ---------------------------------------------
  const ServeProfileAvatar = () => {
    if (!activeUser) return null;

    const { bad_listname, bad_profile_photo_url } = activeUser;

    const alt = bad_listname || "Profile Picture";

    return (
      <div className="flex" style={{ justifyContent: "flex-end" }}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: `50%`,
            overflow: `hidden`,
          }}
        >
          <Image
            src={bad_profile_photo_url || ProfileAvatar}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    );
  };

  const ServeProfileName = () => {
    if (!activeUser) return null;

    const { fullname } = activeUser;

    return (
      <div className="primary-title" style={{ fontSize: 36 }}>
        <Html2React html={fullname} />
      </div>
    );
  };

  const ServeProfileInfo = () => {
    if (!activeUser) return null;

    const { emailaddress1, address2_line2 } = activeUser;

    return (
      <div className="flex-col" style={{ paddingTop: `1em`, fontSize: 20 }}>
        <div style={{ padding: "1em 0" }}>
          <span className="primary-title">Email: </span>
          <Html2React html={emailaddress1} />
        </div>
        <div>
          <span className="primary-title">Current Outstanding Balance: </span>
          <Html2React html={address2_line2} />
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        display: "grid",
        gridTemplateColumns: `2fr 1fr`,
        justifyContent: "space-between",
        gap: 20,
        padding: `2em 4em`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div style={{ display: "grid", alignItems: "center" }}>
        <ServeProfileName />
        <ServeProfileInfo />
      </div>

      <ServeProfileAvatar />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Profile);
