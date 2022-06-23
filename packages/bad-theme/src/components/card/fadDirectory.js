import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";
import { colors } from "../../config/imports";
import ProfileAvatar from "../../img/svg/profile.svg";
// --------------------------------------------------------------------------------
import { setGoToAction, Parcer } from "../../context";

const FadDirectory = ({ state, actions, libraries, fadDirectory }) => {
  if (!fadDirectory) return null;

  const {
    fullname,
    emailaddress1,
    bad_mainhosptialweb,
    jobtitle,
    _parentcustomerid_value,
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
            overflow: "hidden",
            border: `1px solid ${colors.silver}`,
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
        <Parcer libraries={libraries} html={fullname} />
      </div>
    );
  };

  const ServeEmail = () => {
    if (!emailaddress1) return null;

    return (
      <div className="flex">
        <Parcer libraries={libraries} html={emailaddress1} />
      </div>
    );
  };

  const ServeJobTitle = () => {
    if (!jobtitle) return null;

    return (
      <div className="flex">
        <Parcer libraries={libraries} html={jobtitle} />
      </div>
    );
  };

  const ServeHospital = () => {
    if (!_parentcustomerid_value) return null;

    return (
      <div
        className="flex"
        onClick={() =>
          setGoToAction({ state, path: bad_mainhosptialweb, actions })
        }
        style={{ cursor: "pointer" }}
      >
        <Parcer libraries={libraries} html={_parentcustomerid_value} />
      </div>
    );
  };

  const ServeHospitalUrl = () => {
    if (!bad_mainhosptialweb) return null;

    return (
      <div
        className="flex"
        onClick={() =>
          setGoToAction({ state, path: bad_mainhosptialweb, actions })
        }
        style={{ cursor: "pointer" }}
      >
        <Parcer libraries={libraries} html={bad_mainhosptialweb} />
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
