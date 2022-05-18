import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT --------------------------------------------------------
import { muiQuery, getMediaCategories } from "../../context";

const NewsCarousel = ({
  state,
  actions,
  libraries,
  newsCarousel,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!newsCarousel) return null;
  const { lg } = muiQuery();
  const {
    date,
    release,
    title,
    categories,
    featured_media,
    excerpt,
    yoast_head_json,
    categoryList,
  } = newsCarousel;

  // SERVERS ---------------------------------------------
  const ServeRelease = () => {
    if (!release) return null;

    return (
      <div
        style={{
          fontSize: 12,
          textTransform: "capitalize",
          letterSpacing: 2,
          paddingLeft: date ? `1em` : 0,
        }}
      >
        <Html2React html={release} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;
    const datePublished = new Date(date);

    return (
      <div
        className="flex"
        style={{
          fontSize: 12,
          fontWeight: "bold",
          paddingRight: release ? `1em` : 0,
        }}
      >
        <Html2React html={DATE_MODULE.format(datePublished, "DD MMM YYYY")} />
      </div>
    );
  };

  const ServeCategory = () => {
    if (!categoryList || !categories) return null;

    const filter = categoryList.filter(
      (item) => item.id === Number(categories[0])
    );
    const categoryName = filter[0].name;

    return (
      <div
        style={{
          fontSize: 12,
          color: colors.blue,
          textTransform: "uppercase",
          letterSpacing: 2,
          paddingLeft: date ? `2em` : 0,
        }}
      >
        <Html2React html={categoryName} />
      </div>
    );
  };

  const ServeImage = () => {
    if (!featured_media) return null;

    let media = null;
    if (yoast_head_json) media = yoast_head_json.og_image[0].url;
    const alt = title.rendered || "BAD";

    if (!media) return null;

    return (
      <div
        style={{
          width: "100%",
          height: 250,
          overflow: "hidden",
        }}
      >
        <Image
          src={media}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          className="card-image-animated"
        />
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title || featured_media) return null;

    return (
      <div
        className="primary-title"
        style={{ padding: `2em 2em 0 0`, fontSize: 20 }}
      >
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!excerpt || !title) return null;
    if (lg) return null;
    const first_sentence = excerpt.rendered.split(".");
    const shorter = first_sentence[0].toString().concat("...");
    if (featured_media)
      return (
        <div
          className="primary-title"
          style={{ padding: `2em 1.5em`, fontSize: 20 }}
        >
          <Html2React html={title.rendered} />
        </div>
      );

    return (
      <div
        style={{ padding: `1em 1.5em` }}
        className="news-carousel-limited-body"
      >
        <Html2React html={shorter} />
      </div>
    );
  };

  const ServePlaceholder = () => {
    if (featured_media) return null;

    return (
      <div
        style={{
          width: "100%",
          height: 250,
          backgroundColor: colors.silverFillTwo,
        }}
      />
    );
  };

  return (
    <div className="position-relative heading-tile">
      <ServeImage />
      <ServePlaceholder />
      <div
        className="position-absolute heading-tile"
        style={{ top: `3em`, left: `2em` }}
      >
        <div>
          <div
            className="flex-row"
            style={{
              backgroundColor: colors.white,
              width: `fit-content`,
              padding: `1em`,
            }}
          >
            <ServeDate />
            <ServeRelease />
            <ServeCategory />
          </div>
        </div>
        <ServeTitle />
      </div>
      <ServeBody />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarousel);
