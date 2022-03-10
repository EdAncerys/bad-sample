import { useState } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import { setGoToAction } from "../context";
import Loading from "./loading";
import DownloadFileBlock from "../components/downloadFileBlock";

const FullWidthContentBlock = ({
  state,
  actions,
  libraries,
  block,
  disableMargin,
  heroBanner,
  disablePadding,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    background_colour,
    body,
    email,
    label,
    link,
    padding,
    text_align,
    title,
    disable_vertical_padding,
    downloads,
    file,
    button_label,
    button_type,
  } = block;
  console.log("block", block); // debug

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let ALIGNMENT = "start";
  let MARGIN = `0 0`;
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";
  if (padding === "medium") MARGIN = `0 10%`;
  if (padding === "large") MARGIN = `0 15%`;
  if (disableMargin) MARGIN = `0 0 0 ${marginHorizontal}px`;

  let PADDING = `${marginVertical}px ${marginHorizontal}px`;
  if (heroBanner) PADDING = `0 1em 0 ${marginHorizontal}px`;
  if (disablePadding) PADDING = 0;

  let BACKGROUND_COLOUR = background_colour || "transparent";

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div>
        <div className="primary-title" style={{ fontSize: 36 }}>
          <Html2React html={title} />
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    if (!body) return null;

    return (
      <div className="flex-col">
        <div className="card-text">
          <Html2React html={body} />
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    if (!link) return null;

    let LABEL = "More";
    if (label) LABEL = label;

    const handleSubmitAction = () => {
      if (email) {
        // "mailto:"+email+"?subject="+subject+"&body="+emailBody;
        document.location = "mailto:" + email;
        return;
      }

      setGoToAction({ path: link.url, actions });
    };

    return (
      <div>
        <div
          className="flex"
          style={{ justifyContent: ALIGNMENT, paddingTop: `1em` }}
        >
          <div className="blue-btn" onClick={handleSubmitAction}>
            <Html2React html={LABEL} />
          </div>
        </div>
      </div>
    );
  };

  const ServeDownloads = () => {
    if (!downloads) return null;

    return (
      <div
        style={{
          display: "grid",
          gap: `1em`,
          padding: `1em 0`,
          justifyContent: ALIGNMENT,
        }}
      >
        {downloads.map((download, key) => {
          return (
            <div key={key}>
              <DownloadFileBlock block={download} disableMargin />
            </div>
          );
        })}
      </div>
    );
  };

  const ServeFileDownload = () => {
    if (!file) return null;

    return (
      <div
        style={{
          display: "grid",
          gap: `1em`,
          padding: `1em 0`,
          justifyContent: ALIGNMENT,
        }}
      >
        <DownloadFileBlock
          block={{ file, label: button_label, type: button_type }}
          disableMargin
        />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="text-body"
      style={{
        justifyContent: "center",
        textAlign: ALIGNMENT,
        backgroundColor: BACKGROUND_COLOUR,
        minHeight: "auto",
        padding: PADDING,
      }}
    >
      <div style={{ margin: heroBanner ? 0 : MARGIN }}>
        <ServeTitle />
        <ServeCardBody />
        <ServeDownloads />
        <ServeFileDownload />
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FullWidthContentBlock);
