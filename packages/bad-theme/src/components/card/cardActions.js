import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import DownloadFileBlock from "../downloadFileBlock";

const CardActions = ({
  state,
  actions,
  libraries,
  link,
  form_link,
  downloadFile,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ path }) => {
    // console.log("link", link); // debug
    actions.router.set(`${path}`);
  };

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link) return null;

    return (
      <div onClick={() => handleGoToPath({ path: link })}>
        <div style={styles.footerActionTitle}>
          <p className="card-text">Read More</p>
        </div>
      </div>
    );
  };

  const ServeFromAction = () => {
    if (!form_link) return null;

    return (
      <div onClick={() => handleGoToPath({ path: form_link })}>
        <div style={styles.footerActionTitle}>
          <p className="card-text">Nomination Form</p>
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
        style={{ justifyContent: "space-between", marginTop: `2em` }}
      >
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
