import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import ReactPlayer from "react-player";

import Currency from "../../img/svg/currency.svg";
import date from "date-and-time";
const DATE_MODULE = date;

import { colors } from "../../config/imports";

const VideoGuide = ({ state, actions, libraries, videoGuide }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!videoGuide) return null;

  const title = videoGuide.title.rendered;
  const price = videoGuide.acf ? videoGuide.acf.price : null;
  const date = videoGuide.date;
  const event_video = videoGuide.acf ? videoGuide.acf.event_video : null;
  const video = videoGuide.acf ? videoGuide.acf.video : null;
  console.log(videoGuide);

  // SERVERS ---------------------------------------------
  const ServeAmount = () => {
    if (!price) return null;

    return (
      <div style={{ paddingLeft: `0.5em` }}>
        <div
          style={{
            width: 20,
            height: 20,
          }}
        >
          <Image
            src={Currency}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        {/* <div style={{ paddingLeft: `0.5em` }}>
          <Html2React html={price} />
        </div> */}
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div className="flex">
        <div
          className="primary-title"
          style={{ fontSize: 20, lineHeight: "revert" }}
        >
          <Html2React html={title} />
        </div>
        <ServeAmount />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

    return (
      <div>
        <div>
          <Html2React html={formattedDate} />
        </div>
      </div>
    );
  };

  const ServeVideo = () => {
    if (!video) return null;
    console.log(video);

    return (
      <div
        style={{
          width: "100%",
          minHeight: 350,
          overflow: "auto",
        }}
      >
        <ReactPlayer
          url={video}
          // alt={alt}
          width="100%"
          height="100%"
          style={{
            objectFit: "cover",
          }}
          // playing
          muted
          controls
        />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeVideo />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr auto`,
          justifyContent: "space-between",
          gap: 20,
          padding: `1em 1.5em 0`,
        }}
      >
        <ServeTitle />
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(VideoGuide);
