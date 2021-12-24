import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";

import PDF from "../img/svg/pdf.svg";

const DownloadFileBlock = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  disableMargin,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return null;

  const { file, label, guidline_file, disable_vertical_padding } = block;

  const ICON_WIDTH = 35;
  let LABEL = "Download";
  if (label) LABEL = label;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    if (!file) return null;

    return (
      <div
        style={{
          borderBottom: `1px solid ${colors.black}`,
          textTransform: "uppercase",
          fontSize: 12,
          cursor: "pointer",
          marginLeft: `1em`,
        }}
      >
        <a
          href={file.url}
          target="_blank"
          download
          style={{ color: colors.textMain }}
        >
          <Html2React html={LABEL} />
        </a>
      </div>
    );
  };

  const ServeGSActions = () => {
    if (!guidline_file) return null;

    let fileName = "Read Guideline";

    const MAX_LENGTH = 20;
    let titlePreview = `${guidline_file.title.substring(0, MAX_LENGTH)}...`;
    if (guidline_file.title.length < MAX_LENGTH)
      titlePreview = guidline_file.title;
    if (guidelines) fileName = titlePreview;

    return (
      <div
        style={{
          borderBottom: `1px solid ${colors.black}`,
          textTransform: "uppercase",
          fontSize: 12,
          cursor: "pointer",
          marginLeft: `1em`,
        }}
      >
        <a
          href={guidline_file.url}
          target="_blank"
          download
          style={{ color: colors.textMain }}
        >
          <Html2React html={fileName} />
        </a>
      </div>
    );
  };

  return (
    <div
      style={{
        margin: disableMargin ? 0 : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div className="flex-row" style={{ alignItems: "center" }}>
        <div style={{ marginRight: `1em` }}>
          <Image
            src={PDF}
            style={{
              width: ICON_WIDTH,
              height: ICON_WIDTH,
            }}
          />
        </div>
        <ServeActions />
        <ServeGSActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DownloadFileBlock);
