import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";

import PDF from "../img/svg/pdf.svg";

const DownloadFileBlock = ({
  state,
  actions,
  libraries,
  block,
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
          <Html2React html={"Read Guideline"} />
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
