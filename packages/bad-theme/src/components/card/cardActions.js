import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import DownloadFileBlock from "../downloadFileBlock";

const CardActions = ({
  state,
  actions,
  libraries,
  label,
  link,
  form_label,
  form_link,
  downloadFile,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!link && !form_link && !downloadFile) return null;
  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ path }) => {
    // console.log("link", link); // debug
    actions.router.set(`${path}`);
  };

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link) return null;
    let GO_TO_LABEL = "Read More";
    if (label) GO_TO_LABEL = <Html2React html={label} />;

    const handleRedirectLink = () => {
      if (link.includes(`http://3.9.193.188/`))
        return handleGoToPath({ path: link });
      window.open(link, "_blank");
    };

    return (
      <div onClick={handleRedirectLink}>
        <div style={styles.footerActionTitle}>
          <div
            style={{
              borderBottom: `4px solid ${colors.darkSilver}`,
              paddingBottom: 5,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {GO_TO_LABEL}
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
      <div style={styles.footerActionTitle}>
        <div
          style={{
            borderBottom: `4px solid ${colors.darkSilver}`,
            paddingBottom: 5,
            textTransform: "capitalize",
            cursor: "pointer",
          }}
          onClick={() => console.log(form_link)}
        >
          <a href={form_link} target="_blank" download>
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
          fontSize: 12,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: `2em`,
        }}
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
