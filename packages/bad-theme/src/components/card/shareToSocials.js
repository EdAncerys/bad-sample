import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import * as Add2Calendar from "add2calendar";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import Facebook from "../../img/svg/facebookBlack.svg";
import Twitter from "../../img/svg/twitterBlack.svg";
import Instagram from "../../img/svg/instagramBlack.svg";
import Linkedin from "../../img/svg/linkedinBlack.svg";
import Connect from "../../img/svg/connectBlack.svg";
import WebPage from "../../img/svg/webPageBlack.svg";

const ShareToSocials = ({
  state,
  actions,
  shareUrl,
  shareTitle,
  description,
  location,
  date,
  isCalendarLink,
}) => {
  const title = shareTitle || "BAD";
  const url = shareUrl || state.auth.APP_URL;

  // HANDLERS --------------------------------------------
  // ⬇️ add to calendar functionality
  // const singleEventArgs = {
  //   title: title || "",
  //   start: date || new Date(),
  //   end: date || new Date(),
  //   location: location || "",
  //   description: description || "",
  //   isAllDay: false,
  // };
  // const singleEvent = new Add2Calendar(singleEventArgs);

  const copyToClipboard = (e) => {
    const link = e.target.name;

    var input = document.body.appendChild(document.createElement("input"));
    input.value = link;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.parentNode.removeChild(input);
  };

  return (
    <div style={{ padding: `1em 0` }}>
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <div style={styles.socials}>
          <FacebookShareButton
            url={url}
            quote={title}
            className="Demo__some-network__share-button"
          >
            <Image src={Facebook} className="d-block h-100" alt="Facebook" />
          </FacebookShareButton>
        </div>
        <div style={styles.socials}>
          <TwitterShareButton
            url={url}
            title={title}
            className="Demo__some-network__share-button"
          >
            <Image src={Twitter} className="d-block h-100" alt="Twitter" />
          </TwitterShareButton>
        </div>
        {/* <div style={styles.socials}>
            <LinkedinShareButton
              url={url}
              className="Demo__some-network__share-button"
            >
              <Image
                src={Instagram}
                className="d-block h-100"
                alt="Instagram"
              />
            </LinkedinShareButton>
          </div> */}
        <div style={styles.socials}>
          <LinkedinShareButton
            url={url}
            className="Demo__some-network__share-button"
          >
            <Image src={Linkedin} className="d-block h-100" alt="Instagram" />
          </LinkedinShareButton>
        </div>
        <div style={styles.socials} onClick={copyToClipboard}>
          <Image
            src={Connect}
            className="d-block h-100"
            alt="Connect"
            name={`${title}`}
          />
        </div>
        {isCalendarLink && (
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={WebPage} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  socials: {
    display: "grid",
    cursor: "pointer",
  },
};

export default connect(ShareToSocials);
