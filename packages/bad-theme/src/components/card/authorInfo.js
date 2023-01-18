import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../../config/imports";
import ShareToSocials from "./shareToSocials";
import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT ----------------------------------------------------------------
import { copyToClipboard, Parcer } from "../../context";

const AuthorInfo = ({ state, actions, libraries, authorInfo }) => {
  if (!authorInfo) return null;

  const { date, modified, tags, content } = authorInfo;
  const { press_release_authors, show_modified_date } = authorInfo.acf;

  const mountedRef = useRef(true);
  const [tagData, setTagData] = useState(null);
  const [podcastId, setPodcastId] = useState(null);

  const ICON_WIDTH = 100;
  const title = authorInfo.title ? authorInfo.title.rendered : null;

  // remove first / from string if its exist in the url
  const removeFirstSlash = (url) => {
    if (url?.startsWith("/")) {
      return url.substring(1);
    }
    return url;
  };
  const shareUrl = state.auth.APP_URL + removeFirstSlash(state.router.link);
  const shareTitle = title || "BAD";

  useEffect(async () => {
    if (state.source.category) {
      // get post tags
      const tagNames = Object.values(state.source.tag);
      // get Podcast category id
      const categoryData = Object.values(state.source.category);
      let podcastCatId = categoryData.filter((cat) => cat.name === "Podcast");

      if (podcastCatId.length > 0) {
        podcastCatId = podcastCatId[0].id;
      } else {
        podcastCatId = null;
      }

      setTagData(tagNames);
      setPodcastId(podcastCatId);
    }

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

  // HANDLERS --------------------------------------------
  const mailToClient = (e) => {
    copyToClipboard(e);

    // set user notification if email client is not available & copy to clipboard
    const emailValue = e.target.innerText;
    const clipboard = document.querySelector(`.clipboard-reference`); // placeholder selector

    document.location = "mailto:" + emailValue; // open default email client
    clipboard.classList.remove("d-none");
    setTimeout(() => {
      clipboard.classList.add("d-none");
    }, 1000);
  };

  // SERVERS ---------------------------------------------
  const ServeDate = () => {
    if (!date || !modified) return null;
    const datePublished = new Date(date);
    const dateModified = new Date(modified);

    const ServeModified = () => {
      if (datePublished === dateModified || !show_modified_date) return null;

      return (
        <div style={styles.container}>
          <div>Modified -</div>
          <Parcer
            libraries={libraries}
            html={DATE_MODULE.format(dateModified, "DD/MMM/YYYY")}
          />
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
          <Parcer
            libraries={libraries}
            html={DATE_MODULE.format(datePublished, "DD/MMM/YYYY")}
          />
        </div>
        <ServeModified />
      </div>
    );
  };

  const ServeProfile = () => {
    if (!press_release_authors) return null;

    const ServeProfilePhoto = ({ author }) => {
      if (!author.press_release_author_photo) return null;

      const alt = author.press_release_author_name || "BAD";
      const url = author.press_release_author_photo.url;

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
              objectFit: "cover",
            }}
          />
        </div>
      );
    };

    const ServeName = ({ author }) => {
      if (!author.press_release_author_name) return null;

      return (
        <div style={{ fontWeight: "bold", padding: `0.5em 0` }}>
          <Parcer
            libraries={libraries}
            html={author.press_release_author_name}
          />
        </div>
      );
    };

    const ServeEmail = ({ author }) => {
      if (!author.email) return null;

      return (
        <div
          email={author.email}
          className="title-link-animation"
          onClick={mailToClient}
          style={{ marginBottom: `0.5em` }}
        >
          <div style={styles.link}>
            <Parcer libraries={libraries} html={author.email} />
          </div>
          <span className="clipboard-reference d-none" />
        </div>
      );
    };

    const ServeHospital = ({ author }) => {
      if (!author.press_release_author_hospital) return null;

      return (
        <div>
          <Parcer
            libraries={libraries}
            html={author.press_release_author_hospital}
          />
        </div>
      );
    };

    const isPodcast = authorInfo.categories.includes(podcastId);

    let postUserTitle = "Author";
    if (isPodcast) postUserTitle = "Guests";

    return (
      <div>
        <div className="primary-title" style={{ fontSize: 20 }}>
          {postUserTitle}
        </div>
        {press_release_authors.map((author, index) => {
          return (
            <div key={index}>
              <ServeProfilePhoto author={author} />
              <ServeName author={author} />
              <ServeHospital author={author} />
              <ServeEmail author={author} />
            </div>
          );
        })}
      </div>
    );
  };

  const ServeTopics = () => {
    if (!tags.length || !tagData) return null;

    return (
      <div
        style={{
          padding: `0.5em 0`,
          borderBottom: `1px solid ${colors.lightSilver}`,
        }}
      >
        <div
          className="primary-title"
          style={{ fontSize: 20, fontWeight: "bold" }}
        >
          Topics
        </div>
        <div className="flex-col" style={{ fontSize: 16 }}>
          {tags.map((tag, key) => {
            const filter = tagData.filter((item) => item.id === Number(tag));
            const categoryName = filter[0].name;

            return (
              <div
                key={key}
                style={{
                  padding: `0.5em`,
                  marginTop: `1em`,
                  backgroundColor: colors.lightSilver,
                  textTransform: "capitalize",
                }}
              >
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
      <ShareToSocials
        shareTitle={shareTitle}
        description={content.rendered}
        shareUrl={shareUrl}
        date={date}
        isCalendarLink
      />
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
    cursor: "pointer",
  },
};

export default connect(AuthorInfo);
