import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import ProfileAvatar from "../../img/svg/profile.svg";

const DermGroupe = ({ state, actions, libraries, dermGroupe }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!dermGroupe) return null;

  const { email, logo, telephone_helpline, website_url } = dermGroupe;

  // HANDLERS --------------------------------------------
  const copyToClipboard = (e) => {
    document.location = "mailto:" + email; // open default email client

    const emailValue = e.target.innerText;
    const clipboard = document.querySelector(`.clipboard-reference`); // placeholder selector

    // set user notification if email client is not available & copy to clipboard
    clipboard.classList.remove("d-none");
    setTimeout(() => {
      clipboard.classList.add("d-none");
    }, 1000);

    var input = document.body.appendChild(document.createElement("input"));
    input.value = emailValue;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.parentNode.removeChild(input);
  };

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    if (!logo) return null;

    const alt = logo;

    return (
      <div className="flex" style={{ paddingBottom: `2em`, margin: `auto` }}>
        <div style={{ height: `100%`, width: 200 }}>
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
    let padding = `2em`;
    if (!website_url && !telephone_helpline) padding = `0`;

    return (
      <div
        className="flex-col primary-title"
        style={{ paddingBottom: padding }}
      >
        <div style={{ fontSize: 20 }}>Contact Email:</div>
        <div
          email={email}
          className="title-link-animation"
          onClick={copyToClipboard}
        >
          <div style={styles.link}>
            <Html2React html={email} />
          </div>
          <span className="clipboard-reference d-none" />
        </div>
      </div>
    );
  };

  const ServeWebsite = () => {
    if (!website_url) return null;
    let padding = telephone_helpline ? `2em` : 0;

    return (
      <div
        className="flex-col primary-title"
        onClick={() => setGoToAction({ path: website_url, actions })}
        style={{ paddingBottom: padding }}
      >
        <div style={{ fontSize: 20 }}>Website:</div>
        <div className="title-link-animation">
          <Html2React html={website_url} />
        </div>
      </div>
    );
  };

  const ServePhone = () => {
    if (!telephone_helpline) return null;

    return (
      <div className="flex-col primary-title">
        <div style={{ fontSize: 20 }}>Phone Number:</div>
        <div className="title-link-animation" style={{ cursor: "pointer" }}>
          <Html2React html={telephone_helpline} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col text-wrap">
      <ServeCardImage />
      <ServeEmail />
      <ServeWebsite />
      <ServePhone />
    </div>
  );
};

const styles = {
  link: { boxShadow: "none", color: "inherit" },
};

export default connect(DermGroupe);
