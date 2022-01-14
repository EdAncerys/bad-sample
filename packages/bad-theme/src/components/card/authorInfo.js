import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

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

  const [category, setCategory] = useState(null);
  const ICON_WIDTH = 100;
  const { categories, date, modified } = authorInfo;
  const { press_release_authors } = authorInfo.acf;

  useEffect(async () => {
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      const filter = CATEGORY.filter(
        (item) => item.id === Number(categories[0])
      );
      const categoryName = filter[0].name;
      setCategory(categoryName);
    }

    return () => {
      mountedRef.current = false;   // clean up function
    };
  }, []);

  // SERVERS ---------------------------------------------
  const ServeDate = () => {
    if (!date || !modified) return null;
    const datePublished = new Date(date);
    const dateModified = new Date(date);

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
        <div style={styles.container}>
          <div>Modified -</div>
          <Html2React html={DATE_MODULE.format(dateModified, "DD/MMM/YYYY")} />
        </div>
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

      return (
        <div style={{ fontWeight: "bold", padding: `1em 0` }}>
          <Html2React html={name} />
        </div>
      );
    };

    const ServeHospital = () => {
      const hospital = press_release_authors[0].press_release_author_hospital;

      return (
        <div>
          <Html2React html={hospital} />
        </div>
      );
    };

    return (
      <div>
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.softBlack,
          }}
        >
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
            <Link link={`https://www.facebook.com/`} target="_blank">
              <Image src={Facebook} className="d-block h-100" alt="Facebook" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.twitter.com/`} target="_blank">
              <Image src={Twitter} className="d-block h-100" alt="Twitter" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.instagram.com/`} target="_blank">
              <Image
                src={Instagram}
                className="d-block h-100"
                alt="Instagram"
              />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={Linkedin} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={Connect} className="d-block h-100" alt="Instagram" />
            </Link>
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
};

export default connect(AuthorInfo);
