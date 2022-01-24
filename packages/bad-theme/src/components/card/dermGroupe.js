import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import ProfileAvatar from "../../img/svg/profile.svg";

const DermGroupe = ({ state, actions, libraries, dermGroupe }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!dermGroupe) return null;

  const { email, logo, telephone_helpline, website_url } = dermGroupe;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    if (!logo) return null;

    const alt = logo;

    return (
      <div className="flex" style={{ paddingBottom: `1em` }}>
        <div style={{ height: `100%` }}>
          <Image
            src={logo}
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

  const ServeEmail = () => {
    if (!email) return null;

    return (
      <div
        className="flex primary-title"
        style={{ fontSize: 20, paddingBottom: `0.5em` }}
      >
        <Html2React html={email} />
      </div>
    );
  };

  const ServeWebsite = () => {
    if (!website_url) return null;

    return (
      <div
        value="Website"
        className="flex primary-title title-link-animation"
        onClick={() => setGoToAction({ path: website_url, actions })}
        style={{
          fontSize: 20,
          cursor: "pointer",
          marginBottom: `0.25em`,
          paddingBottom: `0.25em`,
        }}
      >
        <Html2React html={"Website"} />
      </div>
    );
  };

  const ServePhone = () => {
    if (!telephone_helpline) return null;

    return (
      <div
        className="flex primary-title"
        style={{ fontSize: 20, paddingBottom: `0.5em` }}
      >
        <Html2React html={telephone_helpline} />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeCardImage />
      <ServeEmail />
      <ServeWebsite />
      <ServePhone />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DermGroupe);
