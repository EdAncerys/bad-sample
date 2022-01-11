import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import ProfileAvatar from "../../img/svg/profile.svg";

const Profile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  let PROFILE_NAME = "Hello Dr. Katie Lewis";

  // SERVERS ---------------------------------------------
  const ServeProfileAvatar = () => {
    const alt = PROFILE_NAME;

    return (
      <div className="flex" style={{ justifyContent: "flex-end" }}>
        <div style={{ width: 190, height: 190 }}>
          <Image
            src={ProfileAvatar}
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
        <div className="primary-title" style={{ fontSize: 36 }}>
          <Html2React html={PROFILE_NAME} />
        </div>

        <div style={{ paddingTop: `1em` }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>

      <ServeProfileAvatar />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Profile);
