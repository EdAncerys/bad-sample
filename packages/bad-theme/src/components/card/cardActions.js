import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import DownloadFileBlock from "../downloadFileBlock";
import { setGoToAction } from "../../context";

const CardActions = ({
  state,
  actions,
  libraries,
  link_label,
  link,
  form_label,
  form_link,
  downloadFile,
  handler,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!link && !form_link && !downloadFile && !handler) return null;

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link) return null;
    let GO_TO_LABEL = "More";
    if (link_label) GO_TO_LABEL = <Html2React html={link_label} />;

    return (
      <div onClick={() => setGoToAction({ path: link, actions })}>
        <div>
          <div className="caps-btn">{GO_TO_LABEL}</div>
        </div>
      </div>
    );
  };

  const ServeHandlerAction = () => {
    if (!handler) return null;
    let GO_TO_LABEL = "More";
    if (link_label) GO_TO_LABEL = link_label;
    console.log(link_label, handler);

    return (
      <div onClick={handler}>
        <div>
          <div className="caps-btn">
            <Html2React html={GO_TO_LABEL} />
          </div>
        </div>
      </div>
    );
  };

  const ServeFromAction = () => {
    if (!form_link) return null;

    let GO_TO_LABEL = "Nomination Form";
    if (form_label) GO_TO_LABEL = <Html2React html={form_label} />;

    return (
      <div>
        <div className="caps-btn">
          <a
            href={form_link}
            target="_blank"
            download
            style={{ color: colors.textMain }}
          >
            {GO_TO_LABEL}
          </a>
        </div>
      </div>
    );
  };

  const ServeFileAction = () => {
    if (!downloadFile) return null;

    return <DownloadFileBlock block={downloadFile} disableMargin />;
  };

  return (
    <div>
      <div
        className="flex-row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: `1em`,
        }}
      >
        <ServeHandlerAction />
        <ServeFileAction />
        <ServeReadMoreAction />
        <ServeFromAction />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardActions);
