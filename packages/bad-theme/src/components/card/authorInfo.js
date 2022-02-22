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
import date from "date-and-time";
import { setGoToAction } from "../../context";

import Facebook from "../../img/svg/facebookBlack.svg";
import Twitter from "../../img/svg/twitterBlack.svg";
import Instagram from "../../img/svg/instagramBlack.svg";
import Linkedin from "../../img/svg/linkedinBlack.svg";
import Connect from "../../img/svg/connectBlack.svg";
import WebPage from "../../img/svg/webPageBlack.svg";

const DATE_MODULE = date;

const AuthorInfo = ({ state, actions, libraries, authorInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!authorInfo) return null;

  const mountedRef = useRef(true);
  const [tagData, setTagData] = useState(null);
  const ICON_WIDTH = 100;
  const { date, modified, tags, content } = authorInfo;
  const { press_release_authors } = authorInfo.acf;
  const title = authorInfo.title ? authorInfo.title.rendered : null;

  const shareUrl = state.auth.APP_URL + state.router.link;
  const shareTitle = title || "BAD";

  useEffect(async () => {
    if (state.source.category) {
      const TAG = Object.values(state.source.tag);

      setTagData(TAG);
    }

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

  // HANDLERS --------------------------------------------
  const singleEventArgs = {
    title: shareTitle,
    start: date,
    end: date,
    // location: "London, UK",
    description: content.rendered,
    isAllDay: false,
  };
  const singleEvent = new Add2Calendar(singleEventArgs);

  const copyToClipboard = (e) => {
    const link = e.target.name;

    var input = document.body.appendChild(document.createElement("input"));
    input.value = link;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.parentNode.removeChild(input);
  };

  // SERVERS ---------------------------------------------
  const ServeDate = () => {
    if (!date || !modified) return null;
    const datePublished = new Date(date);
    const dateModified = new Date(modified);

    const ServeModified = () => {
      if (datePublished === dateModified) return null;

      return (
        <div style={styles.container}>
          <div>Modified -</div>
          <Html2React html={DATE_MODULE.format(dateModified, "DD/MMM/YYYY")} />
        </div>
      );
    };

    return (
      <div
        style={{
          padding: `0.5em 0`,
          margin: `1em 0`,
          borderTop: `1px solid ${colors.lightSilver}`,
          borderBottom: `1px solid ${colors.lightSilver}`,
        }}
      >
        <div style={styles.container}>
          <div>Published -</div>
          <Html2React html={DATE_MODULE.format(datePublished, "DD/MMM/YYYY")} />
        </div>
        <ServeModified />
      </div>
    );
  };

  const ServeProfile = () => {
    if (!press_release_authors) return null;

    const ServeProfilePhoto = () => {
      if (!press_release_authors[0].press_release_author_photo) return null;

      const alt = press_release_authors[0].press_release_author_name || "BAD";
      const url = press_release_authors[0].press_release_author_photo.url;

      return (
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
            borderRadius: "50%",
            overflow: "hidden",
            margin: `0.5em 0`,
          }}
        >
          <Image
            src={url}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    };

    const ServeName = () => {
      const name = press_release_authors[0].press_release_author_name;
      if (!name) return null;

      return (
        <div style={{ fontWeight: "bold", padding: `1em 0` }}>
          <Html2React html={name} />
        </div>
      );
    };

    const ServeHospital = () => {
      const hospital = press_release_authors[0].press_release_author_hospital;
      if (!hospital) return null;

      return (
        <div>
          <Html2React html={hospital} />
        </div>
      );
    };

    return (
      <div>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Author
        </div>
        <ServeProfilePhoto />
        <ServeName />
        <ServeHospital />
      </div>
    );
  };

  const ServeSocials = () => {
    return (
      <div
        style={{
          padding: `1em 0`,
          borderTop: `1px solid ${colors.lightSilver}`,
        }}
      >
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div style={styles.socials}>
            <FacebookShareButton
              url={shareUrl}
              quote={shareTitle}
              className="Demo__some-network__share-button"
            >
              <Image src={Facebook} className="d-block h-100" alt="Facebook" />
            </FacebookShareButton>
          </div>
          <div style={styles.socials}>
            <TwitterShareButton
              url={shareUrl}
              title={shareTitle}
              className="Demo__some-network__share-button"
            >
              <Image src={Twitter} className="d-block h-100" alt="Twitter" />
            </TwitterShareButton>
          </div>
          {/* <div style={styles.socials}>
            <LinkedinShareButton
              url={shareUrl}
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
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <Image src={Linkedin} className="d-block h-100" alt="Instagram" />
            </LinkedinShareButton>
          </div>
          <div style={styles.socials} onClick={copyToClipboard}>
            <Image
              src={Connect}
              className="d-block h-100"
              alt="Instagram"
              name={`${shareTitle}`}
            />
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={WebPage} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ServeTopics = () => {
    if (!tags.length || !tagData) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          fontWeight: "bold",
          padding: `0.5em 0`,
        }}
      >
        Topics
        <div className="flex" style={{ fontSize: 16, paddingTop: `1em` }}>
          {tags.map((tag, key) => {
            const filter = tagData.filter((item) => item.id === Number(tag));
            const categoryName = filter[0].name;

            return (
              <div key={key} style={{ paddingRight: 10 }}>
                {categoryName}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeProfile />
      <ServeDate />
      <ServeTopics />
      <ServeSocials />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 2fr`,
    gap: 20,
    padding: `0.5em 0`,
  },
  socials: {
    display: "grid",
  },
};

export default connect(AuthorInfo);
