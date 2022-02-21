import { useState, useEffect, useRef } from "react";
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

  const mountedRef = useRef(true);
  const CATEGORY = Object.values(state.source.category);

  const [category, setCategory] = useState(null);
  const { categories, excerpt, title, date, featured_media } = newsAndMediaInfo;

  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";
  const isLayoutFour = layout === "layout_four";

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
      mountedRef.current = false; // clean up function
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
    if (!title) return null;

    return (
      <div className="primary-title" style={{ fontSize: 20 }}>
        <Html2React html={title.rendered} />
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

  const ServeImage = () => {
    if (!featured_media) return null;

    const media = state.source.attachment[featured_media];
    const alt = title.rendered || "BAD";

    return (
      <div
        style={{
          width: "100%",
          height: 300,
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

  const ServeCategory = () => {
    if (!CATEGORY) return null;

    const filter = CATEGORY.filter((item) => item.id === Number(categories[0]));
    const categoryName = filter[0].name;

    return (
      <div className="primary-title" style={{ fontSize: 20 }}>
        <Html2React html={categoryName} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

    return (
      <div style={{ padding: `1em 0` }}>
        <Html2React html={formattedDate} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!excerpt) return null;

    return (
      <div style={{ padding: `0.5em 0 0` }}>
        <Html2React html={excerpt.rendered} />
      </div>
    );
  };

  const ServeLayoutTwo = () => {
    if (!isLayoutTwo) return null;

    return (
      <div>
        <ServeImage />
        <div style={{ padding: `1em 1.5em 0` }}>
          <ServeCategory />
          <ServeDate />
          <ServeBody />
        </div>
      </div>
    );
  };

  const ServeLayoutThree = () => {
    if (!isLayoutThree) return null;

    return (
      <div style={{ padding: `1em 1.5em 0` }}>
        <div style={{ paddingBottom: `1.5em` }}>
          <div className="flex">
            <div className="flex-col">
              <ServeCategory />
              <ServeDate />
            </div>
            <ServeIcon />
          </div>
        </div>
        <ServeTitle />
      </div>
    );
  };

  const ServeLayoutFour = () => {
    if (!isLayoutFour) return null;

    return (
      <div style={{ padding: `2em 3em 0` }}>
        <ServeTitle />
        <ServeDate />
        <ServeBody />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeLayoutTwo />
      <ServeLayoutThree />
      <ServeLayoutFour />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsAndMediaHeader);
