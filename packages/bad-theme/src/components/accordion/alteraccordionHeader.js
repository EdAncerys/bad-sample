import React, { useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import NiceLogo from "../../img/svg/niceLogo.svg";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { colors } from "../../config/imports";
import AccordionContext from "react-bootstrap/AccordionContext";
// CONTEXT ----------------------------------------------------------------
import { muiQuery } from "../../context";

const AccordionHeader = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  uniqueId,
  membershipApplications,
  hasPreview,
}) => {
  const { sm, md, lg, xl } = muiQuery();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { activeEventKey } = React.useContext(AccordionContext);

  const { subtitle, acf } = block;
  const LOGO_HEIGHT = 35;
  let preview = block.preview;
  if (hasPreview) preview = hasPreview;

  let title = block.title;
  if (fundingBlock || membershipApplications || guidelines)
    title = block.title.rendered;
  const browsero = navigator.userAgent;
  let body = block.body;
  if (fundingBlock) body = block.acf ? block.acf.overview : null;

  let logo = block.logo;
  if (fundingBlock) logo = block.acf.logo;

  let niceAccredited = false;
  if (acf && acf.nice_accredited) niceAccredited = acf.nice_accredited;

  // LEadership team & Standards --------------------------------
  let ltTitle = null;
  let ltAlignTitles = null;

  if (leadershipBlock) {
    ltTitle = block.block.title;
    ltAlignTitles = block.block.align_title;
  }

  const ServeTitle = () => {
    if (!title) return null;

    const ServeSubtitle = () => {
      if (!subtitle) return null;

      return (
        <div
          className={!lg ? "flex" : "flex-col"}
          style={{
            display: "grid",
            fontStyle: "italic",
            padding: !lg ? `0 2em` : 0,
            marginTop: !lg ? null : "1em",
            fontWeight: "normal",
          }}
        >
          <ServeLogo />
          <Html2React html={subtitle} />
        </div>
      );
    };

    return (
      <div>
        <div
          className="flex primary-title"
          style={{
            alignItems: !lg ? "center" : "flex-start",
            lineHeight: "unset",
            flexDirection: !lg ? null : "column",
          }}
        >
          <div style={{ fontSize: 20 }}>
            <Html2React html={title} />
          </div>
          <ServeSubtitle />
        </div>
      </div>
    );
  };

  const ServePreview = () => {
    if (guidelines || !preview || !body) return null;
    if (lg || browsero.includes("Firefox")) return null;
    return (
      <div
        className="text-body body-limit"
        id={`preview-id-${uniqueId}`}
        style={{
          paddingTop: `1em`,
          margin: `1em`,
          color: colors.darkSilver,
          borderTop:
            !lg || browsero.includes("Firefox")
              ? null
              : `1px solid ${colors.darkSilver}`,
          transitionDelay: `1s`,
          WebkitLineClamp: 2,
        }}
      >
        <Html2React html={body} />
      </div>
    );
  };

  const ServeUpdateInProgress = () => {
    if ((acf && !acf.update_in_progress) || !guidelines) return null;

    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          padding: "0 0 4px 2em",
          lineHeight: "unset",
        }}
      >
        <Html2React html={`Update in progress`} />
      </div>
    );
  };

  const ServeLogo = () => {
    if (!logo) return null;
    const alt = logo.title || "BAD";

    return (
      <div
        style={{
          padding: "0 2em",
          margin: `0 4em 0 1em`,
        }}
      >
        <Image src={logo.url} alt={alt} style={{ height: LOGO_HEIGHT }} />
      </div>
    );
  };

  const ServeNICELogo = () => {
    if (!niceAccredited) return null;

    const alt = "NICE";

    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          padding: !lg ? "0 2em" : 0,
        }}
      >
        <Image
          src={NiceLogo}
          alt={alt}
          style={{ height: !lg ? LOGO_HEIGHT : LOGO_HEIGHT / 2 }}
        />
      </div>
    );
  };

  const ServeIcon = () => {
    return (
      <div>
        <div className="flex">
          <div id={`add-icon-${uniqueId}`}>
            {activeEventKey === uniqueId ? (
              <RemoveIcon style={{ fontSize: 48, fill: colors.softBlack }} />
            ) : (
              <AddIcon style={{ fontSize: 48, fill: colors.softBlack }} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const ServeLTTitle = () => {
    if (!ltTitle) return null;
    let ALIGNMENT = "flex-start";
    if (ltAlignTitles === "center") ALIGNMENT = "center";
    if (ltAlignTitles === "right") ALIGNMENT = "flex-end";

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          alignItems: "center",
          justifyContent: ALIGNMENT,
          padding: "0 2em",
          lineHeight: "unset",
        }}
      >
        <Html2React html={ltTitle} />
      </div>
    );
  };

  return (
    <div style={{ position: "relative", transition: "all 0.3s" }}>
      <div className="accordion-header">
        <div className="flex-col">
          <div
            className="flex"
            style={{ margin: 0, padding: `0.5em 1.25em`, alignItems: "center" }}
            data-mdb-toggle="collapse"
          >
            <div className="flex">
              <ServeTitle />
              <ServeLTTitle />
              <ServeUpdateInProgress />

              {!lg ? <ServeLogo /> : null}
              {!lg ? <ServeNICELogo /> : null}
            </div>
            <ServeIcon />
          </div>
        </div>
      </div>
      {activeEventKey === uniqueId ? null : <ServePreview />}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccordionHeader);
