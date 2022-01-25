import { useState, useEffect } from "react";
import { connect } from "frontity";
import path from "path";
import parse from "html-react-parser";

import { colors } from "../config/imports";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import PDF from "../img/svg/badPDF.svg";
import DOC from "../img/svg/badDOC.svg";
import PPT from "../img/svg/badPPT.svg";
import XLS from "../img/svg/badXLS.svg";

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

  const { file, label, guidline_file, disable_vertical_padding, title } = block;

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
      <div value={parse(LABEL)} className="caps-btn">
        <Link href={file.url} target="_blank" download style={styles.link}>
          <Html2React html={LABEL} />
        </Link>
      </div>
    );
  };

  const ServeGSActions = () => {
    if (!guidline_file) return null;

    let fileName = "Read Guideline";
    if (guidelines) fileName = guidline_file.title;
    if (title) fileName = title;

    return (
      <div value={parse(fileName)} className="caps-btn">
        <Link
          href={guidline_file.url}
          target="_blank"
          download
          style={styles.link}
        >
          <Html2React html={fileName} />
        </Link>
      </div>
    );
  };

  const ServeIcon = () => {
    if (!file) return null;

    const fileType = path.extname(file.filename);
    let FILE_ICON = PDF;
    if (fileType.includes("doc")) FILE_ICON = DOC;
    if (fileType.includes("ppt")) FILE_ICON = PPT;
    if (fileType.includes("xls")) FILE_ICON = XLS;

    return (
      <div style={{ marginRight: `1em` }}>
        <Image
          src={FILE_ICON}
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
          }}
        />
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
        <ServeIcon />
        <ServeActions />
        <ServeGSActions />
      </div>
    </div>
  );
};

const styles = {
  link: { boxShadow: "none", color: "inherit" },
};

export default connect(DownloadFileBlock);
