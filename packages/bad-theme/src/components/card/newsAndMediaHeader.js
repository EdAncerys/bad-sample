import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
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
  layout,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!newsAndMediaInfo) return null;

  const [category, setCategory] = useState(null);
  const { categories, excerpt, title, date, featured_media } = newsAndMediaInfo;
  const isLayoutTwo = layout === "layout_two";

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
    if (!title || isLayoutTwo) return null;

    // Manage max string Length
    const MAX_LENGTH = 36;
    let titlePreview = `${title.rendered.substring(0, MAX_LENGTH)}...`;
    if (title.rendered.length < MAX_LENGTH) titlePreview = title.rendered;

    return (
      <div
        className="primary-title"
        style={{ fontSize: 22, fontWeight: "bold", cursor: "pointer" }}
      >
        <Html2React html={titlePreview} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date || isLayoutTwo) return null;
    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD/MM/YYYY");

    return (
      <div style={{ padding: `0.5em 0` }}>
        <Html2React html={formattedDate} />
      </div>
    );
  };

  const ServeIcon = () => {
    if (!category || isLayoutTwo) return null;
    const alt = title.rendered || "BAD";

    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
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

  const ServeMedia = () => {
    if (!isLayoutTwo) return null;

    const CATEGORY = Object.values(state.source.category);
    const filter = CATEGORY.filter((item) => item.id === Number(categories[0]));
    const categoryName = filter[0].name;

    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD/MMM/YYYY");
    const media = state.source.attachment[featured_media];

    // Manage max string Length
    const MAX_LENGTH = 30;
    let bodyPreview = `${excerpt.rendered.substring(0, MAX_LENGTH)}...`;
    if (excerpt.rendered.length < MAX_LENGTH) bodyPreview = excerpt.rendered;

    const ServeImage = () => {
      if (!media) return null;
      const alt = title.rendered || "BAD";

      return (
        <div
          style={{
            width: "100%",
            height: 200,
          }}
        >
          <Image
            src={media.source_url}
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

    return (
      <div>
        <ServeImage />
        <div style={{ padding: `1em 1.5em 0` }}>
          <div
            className="primary-title"
            style={{ fontSize: 22, fontWeight: "bold", cursor: "pointer" }}
          >
            <Html2React html={categoryName} />
          </div>
          <div style={{ padding: `0.5em 0 0` }}>
            <Html2React html={formattedDate} />
          </div>
          <div style={{ padding: `0.5em 0 0` }}>
            <Html2React html={bodyPreview} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: isLayoutTwo ? 0 : `1.5em 1.5em 0` }}>
      <div
        className="flex-col"
        style={{
          justifyContent: "space-between",
          justifyContent: "center",
          color: colors.softBlack,
        }}
      >
        <ServeMedia />
        <ServeTitle />
        <ServeDate />
        <ServeIcon />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsAndMediaHeader);
