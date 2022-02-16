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
  fundingBlock,
  handleAccordionToggle,
  uniqueId,
  membershipApplications,
  hasPreview,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { guidelines_type, subtitle } = block;
  const LOGO_HEIGHT = 45;

  let preview = block.preview;
  if (hasPreview) preview = hasPreview;

  let title = block.title;
  if (fundingBlock || membershipApplications || guidelines)
    title = block.title.rendered;

  let body = block.body;
  if (fundingBlock) body = block.acf ? block.acf.overview : null;

  let logo = block.logo;
  if (fundingBlock) logo = block.acf.logo;

  const isActive = useRef(false);

  // Guidelines & Standards --------------------------------
  let gsPublished_date = null;
  let gsUpdate_in_progress = null;

  if (guidelines) {
    gsPublished_date = block.acf.published_date;
    gsUpdate_in_progress = block.acf.update_in_progress;
  }

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

  const ServePreview = () => {
    if (guidelines || !preview || !body) return null;

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
            style={{ margin: 0, padding: `0.5em 1.25em`, alignItems: "center" }}
            data-mdb-toggle="collapse"
          >
            <ServeTitle />
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
