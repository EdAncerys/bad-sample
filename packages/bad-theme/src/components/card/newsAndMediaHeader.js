import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import date from "date-and-time";
import { setGoToAction } from "../../context";

import Bulletins from "../../img/svg/bulletins.svg";
import eCircular from "../../img/svg/eCircular.svg";
import Insights from "../../img/svg/insights.svg";
import Podcasts from "../../img/svg/podcasts.svg";
import PressRelease from "../../img/svg/pressRelease.svg";
import Responses from "../../img/svg/responses.svg";
import Updates from "../../img/svg/updates.svg";

const DATE_MODULE = date;

const NewsAndMediaHeader = ({
  state,
  actions,
  libraries,
  newsAndMediaInfo,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!newsAndMediaInfo) return null;

  const [category, setCategory] = useState(null);
  const { categories, title, date } = newsAndMediaInfo;

  useEffect(async () => {
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      const filter = CATEGORY.filter(
        (item) => item.id === Number(categories[0])
      );
      const categoryName = filter[0].name;
      setCategory(categoryName);
    }
  }, []);

  const ICON_WIDTH = 40;
  let SERVE_ICON = PressRelease;
  if (category === "Uncategorized" || category === "Presidential Bulletin")
    SERVE_ICON = Bulletins;
  if (category === "Official Response") SERVE_ICON = Responses;
  if (category === "Podcasts") SERVE_ICON = Podcasts;
  if (category === "E-Circular") SERVE_ICON = eCircular;
  if (category === "Insights") SERVE_ICON = Insights;
  if (category === "News &amp; Updates") SERVE_ICON = Updates;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    // Manage max string Length
    const MAX_LENGTH = 24;
    let titlePreview = `${title.rendered.substring(0, MAX_LENGTH)}...`;
    if (title.rendered.length < MAX_LENGTH) titlePreview = title.rendered;

    return (
      <div
        style={{ fontSize: 22, fontWeight: "bold", cursor: "pointer" }}
        // onClick={() => setGoToAction({ path: link, actions })}
      >
        <Html2React html={titlePreview} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;
    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD/MMM/YYYY");

    return (
      <div style={{ padding: `0.5em 0` }}>
        <Html2React html={formattedDate} />
      </div>
    );
  };

  const ServeIcon = () => {
    if (!category) return null;
    const alt = "BAD";

    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
          margin: `0 auto`,
        }}
      >
        <Image
          src={SERVE_ICON}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div
        className="flex-col"
        style={{
          justifyContent: "space-between",
          justifyContent: "center",
          color: colors.black,
        }}
      >
        <ServeTitle />
        <ServeDate />
      </div>
      <ServeIcon />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `3fr 1fr`,
    gap: 5,
    paddingBottom: `1em`,
  },
};

export default connect(NewsAndMediaHeader);
