import { useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import NiceLogo from "../../img/placeholders/niceLogo.svg";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { colors } from "../../config/imports";

const AccordionHeader = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  handleAccordionToggle,
  uniqueId,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { title, body, logo, preview, guidelines_type, subtitle } = block;
  const LOGO_HEIGHT = 45;

  const isActive = useRef(false);

  // Guidelines & Standards --------------------------------
  let gsTitle = null;
  let gsPublished_date = null;
  let gsUpdate_in_progress = null;

  if (guidelines) {
    gsTitle = block.title.rendered;
    gsPublished_date = block.acf.published_date;
    gsUpdate_in_progress = block.acf.update_in_progress;
  }
  // Guidelines & Standards -------------------------------------

  // LEadership team & Standards --------------------------------
  let ltTitle = null;
  let ltAlignTitles = null;

  if (leadershipBlock) {
    ltTitle = block.block.title;
    ltAlignTitles = block.block.align_title;
  }
  // LEadership team & Standards --------------------------------

  const ServeTitle = () => {
    if (!title || guidelines) return null;

    const ServeSubtitle = () => {
      if (!subtitle) return null;

      return (
        <div
          className="flex"
          style={{
            fontStyle: "italic",
            padding: `0 2em`,
            fontWeight: "normal",
          }}
        >
          <Html2React html={subtitle} />
        </div>
      );
    };

    return (
      <div className="flex primary-title" style={{ alignItems: "center" }}>
        <div style={{ fontSize: 20 }}>
          <Html2React html={title} />
        </div>
        <ServeSubtitle />
      </div>
    );
  };

  const ServeGSUpdateInProgress = () => {
    if (!gsUpdate_in_progress) return null;

    return (
      <div>
        <div className="flex">
          <div style={styles.divider} />
          <div style={{ fontStyle: "italic", alignItems: "center" }}>
            Update in Progress
          </div>
        </div>
      </div>
    );
  };

  const ServeGSDate = () => {
    if (!gsPublished_date) return null;

    return (
      <div
        className="flex"
        style={{
          paddingLeft: `2em`,
          color: colors.softBlack,
          alignItems: "center",
        }}
      >
        <div>
          Published <Html2React html={gsPublished_date} />
        </div>
        <ServeGSUpdateInProgress />
      </div>
    );
  };

  const ServeGSTitle = () => {
    if (!gsTitle) return null;

    return (
      <div className="flex" style={{ alignItems: "center" }}>
        <div
          className="primary-title"
          style={{ fontSize: 20, alignItems: "center" }}
        >
          <Html2React html={gsTitle} />
        </div>
        <ServeGSDate />
      </div>
    );
  };

  const ServePreview = () => {
    if (guidelines || !preview) return null;

    // Manage max string Length
    const MAX_LENGTH = 140;
    let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
    if (body.length < MAX_LENGTH) bodyPreview = body;

    return (
      <div
        className="text-body"
        id={`preview-id-${uniqueId}`}
        style={{
          paddingTop: `1em`,
          margin: `0 1.25em`,
          color: colors.darkSilver,
          borderTop: `1px solid ${colors.darkSilver}`,
          transitionDelay: `1s`,
        }}
      >
        <Html2React html={bodyPreview} />
      </div>
    );
  };

  const ServeLogo = () => {
    if (!logo) return null;
    const alt = logo.title || "BAD";

    return (
      <div
        style={{
          padding: `0.25em`,
          margin: `0 4em 0 1em`,
        }}
      >
        <Image src={logo.url} alt={alt} style={{ height: LOGO_HEIGHT }} />
      </div>
    );
  };

  const ServeNICELogo = () => {
    if (!guidelines_type) return null;
    if (!guidelines_type.includes(87)) return null;

    const alt = "Nice";

    return (
      <div
        style={{
          padding: `0.25em`,
          margin: `0 4em 0 1em`,
        }}
      >
        <Image src={NiceLogo} alt={alt} style={{ height: LOGO_HEIGHT }} />
      </div>
    );
  };

  const ServeIcon = () => {
    return (
      <div>
        <div className="flex">
          <div id={`add-icon-${uniqueId}`}>
            <AddIcon style={{ fontSize: 48, fill: colors.softBlack }} />
          </div>
          <div className="d-none" id={`remove-icon-${uniqueId}`}>
            <RemoveIcon style={{ fontSize: 48, fill: colors.softBlack }} />
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
        className="flex primary-title"
        style={{
          fontSize: 20,
          alignItems: "center",
          justifyContent: ALIGNMENT,
        }}
      >
        <Html2React html={ltTitle} />
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="accordion-header">
        <div
          className="flex-col"
          onClick={() => {
            handleAccordionToggle({ isActive: isActive.current });
            isActive.current = !isActive.current; // toggle accordion state tracking
          }}
        >
          <div
            className="flex"
            style={{ margin: 0, padding: `0.5em 1em`, alignItems: "center" }}
            data-mdb-toggle="collapse"
          >
            <ServeTitle />
            <ServeGSTitle />
            <ServeLTTitle />

            <ServeLogo />
            <ServeNICELogo />
            <ServeIcon />
          </div>
        </div>
      </div>
      <ServePreview />
    </div>
  );
};

const styles = {
  divider: {
    margin: `2px 0.5em`,
    borderRight: `1px solid ${colors.darkSilver}`,
  },
  previewIcon: {
    fontSize: 12,
    textTransform: "uppercase",
    height: "100%",
  },
};

export default connect(AccordionHeader);
