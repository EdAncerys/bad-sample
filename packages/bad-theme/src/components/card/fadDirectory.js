import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import Loading from "../loading";
import ProfileAvatar from "../../img/svg/profile.svg";

const FadDirectory = ({ state, actions, libraries, fadDirectory }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!fadDirectory) return null;
  // console.log("fadDirectory", fadDirectory); // debug

  const {
    fullname,
    emailaddress1,
    bad_mainhosptialweb,
    jobtitle,
    bad_profile_photo_url,
  } = fadDirectory;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    const alt = fullname || "BAD";

    const IMG_WIDTH = 75;

    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", paddingBottom: `2em` }}
      >
        <div
          style={{
            height: IMG_WIDTH,
            width: IMG_WIDTH,
            borderRadius: "50%",
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

  const ServeFullName = () => {
    if (!fullname) return null;

    return (
      <div
        className="flex primary-title"
        style={{ fontSize: 20, paddingBottom: `0.5em` }}
      >
        <Html2React html={fullname} />
      </div>
    );
  };

  const ServeEmail = () => {
    if (!emailaddress1) return null;

    return (
      <div className="flex">
        <Html2React html={emailaddress1} />
      </div>
    );
  };

  const ServeJobTitle = () => {
    if (!jobtitle) return null;

    return (
      <div className="flex">
        <Html2React html={jobtitle} />
      </div>
    );
  };

  const ServeHospital = () => {
    const hospitalName =
      fadDirectory[
        "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
      ];

    if (!hospitalName) return null;

    return (
      <div
        className="flex"
        onClick={() => setGoToAction({ path: bad_mainhosptialweb, actions })}
        style={{ cursor: "pointer" }}
      >
        <Html2React html={hospitalName} />
      </div>
    );
  };

  const ServeHospitalUrl = () => {
    if (!bad_mainhosptialweb) return null;

    return (
      <div
        className="flex"
        onClick={() => setGoToAction({ path: bad_mainhosptialweb, actions })}
        style={{ cursor: "pointer" }}
      >
        <Html2React html={bad_mainhosptialweb} />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeCardImage />
      <ServeFullName />
      <ServeJobTitle />
      <ServeEmail />
      <ServeHospital />
      <ServeHospitalUrl />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FadDirectory);
