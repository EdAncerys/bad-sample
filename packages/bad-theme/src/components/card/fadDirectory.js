import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import ProfileAvatar from "../../img/svg/profile.svg";

const FadDirectory = ({ state, actions, libraries, fadDirectory }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!fadDirectory) return null;

  const {
    fullname,
    emailaddress1,
    bad_mainhosptialweb,
    bad_findadermatologisttext,
    contactid,
    profile_image_url,
  } = fadDirectory;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    const alt = contactid || "BAD";

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
            src={profile_image_url || ProfileAvatar}
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
      <div className="flex" style={{ paddingBottom: `0.5em` }}>
        <Html2React html={emailaddress1} />
      </div>
    );
  };

  const ServeJobTitle = () => {
    if (!bad_findadermatologisttext) return null;

    return (
      <div className="flex primary-title">
        <Html2React html={bad_findadermatologisttext} />
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
      <ServeEmail />
      <ServeJobTitle />
      <ServeHospitalUrl />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FadDirectory);
