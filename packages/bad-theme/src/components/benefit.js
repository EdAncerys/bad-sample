import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

import Journal from "../img/svg/journal.svg";
import Education from "../img/svg/education.svg";
import ClinicalServices from "../img/svg/clinicalServices.svg";
import Events from "../img/svg/events.svg";
import Newsletters from "../img/svg/newsletters.svg";
import Fellowships from "../img/svg/fellowships.svg";
import Library from "../img/svg/library.svg";
import HireDiscounts from "../img/svg/hireDiscounts.svg";

const Benefit = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const ICON_WIDTH = 100;
  const { icon, body, title } = block;

  let serveIcon = Journal;
  if (icon === "Education") serveIcon = Education;
  if (icon === "Clinical Services") serveIcon = ClinicalServices;
  if (icon === "Newsletters") serveIcon = Newsletters;
  if (icon === "Events") serveIcon = Events;
  if (icon === "Fellowships") serveIcon = Fellowships;
  if (icon === "Willan Library") serveIcon = Library;
  if (icon === "Room Hire Discount") serveIcon = HireDiscounts;

  // SERVERS ----------------------------------------------------------------
  const ServeProfilePicture = () => {
    if (!icon) return null;
    const alt = title || "BAD";

    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
          margin: `0 auto`,
        }}
      >
        <Image
          src={serveIcon}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            // objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div style={{ fontSize: 20, fontWeight: "bold", margin: `0.75em 0` }}>
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div
        style={{
          fontSize: 16,
          fontWeight: "regular",
          color: colors.darkSilver,
        }}
      >
        <Html2React html={body} />
      </div>
    );
  };

  const ServeProfile = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  return (
    <div style={{ margin: `2em auto` }}>
      <div>
        <ServeProfilePicture />
        <ServeProfile />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Benefit);
