import { useState, useEffect } from "react";
import { connect } from "frontity";
import Accordion from "react-bootstrap/Accordion";
import Image from "@frontity/components/image";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import NiceLogo from "../img/placeholders/niceLogo.svg";
import DownloadFileBlock from "./downloadFileBlock";
import Loading from "./loading";
import { colors } from "../config/colors";
import { setGoToAction } from "../context";
import { v4 as uuidv4 } from "uuid";

const AccordionComponent = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
}) => {
  if (!block) return <Loading />;
  if (!block.accordion_item) return null;

  const { disable_vertical_padding } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block, eventKey }) => {
    const {
      title,
      body,
      logo,
      downloads,
      label,
      link,
      date,
      update_in_progress,
      doi,
      link_to_pil,
      guidelines_type,
    } = block;
    const hasPreview = block.preview === "true";

    // Guidelines & Standards --------------------------------
    let gsTitle = null;
    let gsAuthors = null;
    let gsBlocks = null;
    let gsCollaboration_partners = null;
    let gsDocument_uploads = null;
    let gsLinks = null;
    let gsPublished_date = null;
    let gsSubtitle = null;
    let gsUpdate_in_progress = null;

    if (guidelines) {
      gsTitle = block.title.rendered;
      gsAuthors = block.acf.authors;
      gsBlocks = block.acf.blocks;
      gsCollaboration_partners = block.acf.collaboration_partners;
      gsDocument_uploads = block.acf.document_uploads;
      gsLinks = block.acf.links;
      gsPublished_date = block.acf.published_date;
      gsSubtitle = block.acf.subtitle;
      gsUpdate_in_progress = block.acf.update_in_progress;
    }
    // Guidelines & Standards --------------------------------

    // LEadership team & Standards --------------------------------
    let ltTitle = null;
    let ltBody = null;
    let ltAlignTitles = null;
    let LT_LAYOUT = null;
    let ALL_GRADES = null;

    if (leadershipBlock) {
      ltTitle = block.block.title;
      ltBody = block.block.intro_text;
      ltAlignTitles = block.block.align_title;
      LT_LAYOUT = block.block.layout;
      ALL_GRADES = state.source.leadership_grade;
    }
    // LEadership team & Standards --------------------------------

    // HANDLERS ----------------------------------------------------
    const handleAccordionToggle = () => {
      const addIcon = document.querySelector(`#add-id-${eventKey}`);
      const removeIcon = document.querySelector(`#remove-id-${eventKey}`);
      const moreIcon = document.querySelector(`#more-id-${eventKey}`);
      const lessIcon = document.querySelector(`#less-id-${eventKey}`);
      const preview = document.querySelector(`#preview-id-${eventKey}`);

      // apply toggle to selected components
      if (preview) {
        preview.classList.toggle("d-none");
      }
      if (addIcon) {
        addIcon.classList.toggle("d-none");
      }
      if (removeIcon) {
        if (removeIcon.classList.contains("d-none")) {
          removeIcon.classList.remove("d-none");
        } else {
          removeIcon.classList.add("d-none");
        }
      }

      if (moreIcon) {
        moreIcon.classList.toggle("d-none");
      }
      if (lessIcon) {
        if (lessIcon.classList.contains("d-none")) {
          lessIcon.classList.remove("d-none");
        } else {
          lessIcon.classList.add("d-none");
        }
      }
    };
    // SERVERS ----------------------------------------------------
    const ServeHeader = () => {
      const ServeTitle = () => {
        if (!title || guidelines) return null;

        return (
          <div
            className="flex primary-title"
            style={{
              fontSize: 20,
              color: colors.black,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            <Html2React html={title} />
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
              color: colors.textMain,
              fontSize: 16,
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
          <div
            className="flex primary-title"
            style={{
              fontSize: 20,
              color: colors.black,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            <Html2React html={gsTitle} />
            <ServeGSDate />
          </div>
        );
      };

      const ServePreview = () => {
        if (guidelines || !hasPreview) return null;

        // Manage max string Length
        const MAX_LENGTH = 140;
        let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
        if (body.length < MAX_LENGTH) bodyPreview = body;

        return (
          <div
            id={`preview-id-${eventKey}`}
            style={{
              padding: `1em 0`,
              marginTop: `1.25em`,
              color: colors.darkSilver,
              borderTop: `1px solid ${colors.darkSilver}`,
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
              height: 60,
              padding: `0.25em`,
              margin: `0 4em 0 1em`,
            }}
          >
            <Image
              src={logo.url}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
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
              height: 60,
              padding: `0.25em`,
              margin: `0 4em 0 1em`,
            }}
          >
            <Image
              src={NiceLogo}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        );
      };

      const ServeIcon = () => {
        if (!hasPreview) {
          return (
            <div>
              <div className="flex">
                <div id={`add-id-${eventKey}`}>
                  <AddIcon style={{ fontSize: 48, fill: colors.textMain }} />
                </div>
                <div className="d-none" id={`remove-id-${eventKey}`}>
                  <RemoveIcon style={{ fontSize: 48, fill: colors.textMain }} />
                </div>
              </div>
            </div>
          );
        }
        if (hasPreview) {
          return (
            <div>
              <div className="flex">
                <div id={`more-id-${eventKey}`} style={styles.previewIcon}>
                  See More
                </div>
                <div
                  className="d-none"
                  id={`less-id-${eventKey}`}
                  style={styles.previewIcon}
                >
                  Less
                </div>
              </div>
            </div>
          );
        }
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
              color: colors.black,
              fontWeight: "bold",
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
          <Accordion.Header>
            <div className="flex-col" onClick={handleAccordionToggle}>
              <div
                className="flex"
                style={{ margin: 0, padding: `0.5em 0`, alignItems: "center" }}
                data-mdb-toggle="collapse"
              >
                <ServeTitle />
                <ServeGSTitle />
                <ServeLTTitle />

                <ServeLogo />
                <ServeNICELogo />
                <ServeIcon />
              </div>
              <ServePreview />
            </div>
          </Accordion.Header>
        </div>
      );
    };

    const ServeContent = () => {
      const ServeGSSubTitle = () => {
        if (!gsSubtitle) return null;

        return (
          <div className="flex">
            <Html2React html={gsSubtitle} />
          </div>
        );
      };

      const ServeDownloads = () => {
        if (!gsDocument_uploads && !downloads) return null;

        const files = gsDocument_uploads || downloads;

        return (
          <div className="flex-col" style={{ width: "70%" }}>
            <div
              className="primary-title"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: `2em 0 1em`,
              }}
            >
              Downloads:
            </div>
            <div className="flex" style={{ flexWrap: "wrap" }}>
              {files.map((block, key) => {
                return (
                  <div
                    key={key}
                    style={{ minWidth: "33%", padding: `1em 1em 1em 0` }}
                  >
                    <DownloadFileBlock block={block} guidelines disableMargin />
                  </div>
                );
              })}
            </div>
          </div>
        );
      };

      const ServeGoToPage = () => {
        if (!link || guidelines) return null;

        let LABEL = "More";
        if (label) LABEL = label;

        return (
          <div
            className="flex"
            style={{ justifyContent: "flex-end", paddingTop: `1em` }}
          >
            <div>
              <button
                className="btn flex-row"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: `0.5em 2em`,
                  alignItems: "center",
                }}
                onClick={() => setGoToAction({ path: link.url, actions })}
              >
                <div className="flex">
                  <Html2React html={LABEL} />
                </div>
                <div>
                  <KeyboardArrowRightIcon
                    style={{
                      borderRadius: "50%",
                      padding: 0,
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        );
      };

      const ServeBody = () => {
        if (!body) return null;

        return (
          <div>
            <Html2React html={body} />
          </div>
        );
      };

      const ServeLTBody = () => {
        if (!ltBody) return null;

        return (
          <div>
            <Html2React html={ltBody} />
          </div>
        );
      };

      const ServeLTTeam = () => {
        if (!block.leadershipList) return null;

        const ServeListLayout = ({ item }) => {
          const title = item.title.rendered;
          const hospital = item.acf.hospital;
          const dates = item.acf.dates;

          const ServeTitle = () => {
            if (!title) return null;

            return (
              <div>
                <Html2React html={title} />
              </div>
            );
          };

          const ServeHospital = () => {
            if (!hospital) return null;

            return (
              <div style={{ marginRight: 10 }}>
                <Html2React html={hospital} />
              </div>
            );
          };

          const ServeDates = () => {
            if (!dates) return null;

            return (
              <div>
                <Html2React html={dates} />
              </div>
            );
          };

          return (
            <div style={styles.listLayout}>
              <ServeTitle />
              <div className="flex-row">
                <ServeHospital />
                <ServeDates />
              </div>
            </div>
          );
        };

        const ServeProfileLayout = ({ item }) => {
          const title = item.title.rendered;
          const hospital = item.acf.hospital;
          const dates = item.acf.dates;
          const image = item.acf.image;

          const ServeTitle = () => {
            if (!title) return null;

            return (
              <div>
                <Html2React html={title} />
              </div>
            );
          };

          const ServeHospital = () => {
            if (!hospital) return null;

            return (
              <div style={{ marginRight: 10 }}>
                <Html2React html={hospital} />
              </div>
            );
          };

          const ServeDates = () => {
            if (!dates) return null;

            return (
              <div>
                <Html2React html={dates} />
              </div>
            );
          };

          const ServeCardImage = () => {
            if (!image) return null;
            const alt = title || "BAD";

            return (
              <div
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: `1em 0`,
                }}
              >
                <Image
                  src={image.url}
                  alt={alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          };

          return (
            <div
              className="flex-col"
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <ServeCardImage />
              <ServeTitle />
              <ServeDates />
              <ServeHospital />
            </div>
          );
        };

        let isListLayout = true;
        if (LT_LAYOUT === "officer") isListLayout = false;
        if (LT_LAYOUT === "senior-management") isListLayout = false;
        const jobRole = Object.values(ALL_GRADES).filter(
          (job) => job.slug === LT_LAYOUT
        );
        let rolId = 0;
        if (jobRole[0]) rolId = jobRole[0].id;

        if (isListLayout)
          return (
            <div style={{ padding: `3em 0 0` }}>
              {block.leadershipList.map((item, key) => {
                if (
                  LT_LAYOUT === "executive-committee-regional" &&
                  !item.leadership_grade.includes(rolId)
                )
                  return null;
                if (
                  LT_LAYOUT === "executive-committee-co-opted" &&
                  !item.leadership_grade.includes(rolId)
                )
                  return null;
                if (isListLayout)
                  return <ServeListLayout item={item} key={key} />;
              })}
            </div>
          );

        if (!isListLayout)
          return (
            <div style={styles.profileLayout}>
              {block.leadershipList.map((item, key) => {
                if (
                  LT_LAYOUT === "senior-management" &&
                  !item.leadership_grade.includes(rolId)
                )
                  return null;
                if (
                  LT_LAYOUT === "officer" &&
                  !item.leadership_grade.includes(rolId)
                )
                  return null;

                return <ServeProfileLayout item={item} key={key} />;
              })}
            </div>
          );
      };

      const ServeLink = ({ link }) => {
        if (!link) return null;
        const { label, link_url } = link;

        return (
          <div
            style={{
              borderBottom: `1px solid ${colors.darkSilver}`,
              textTransform: "uppercase",
              fontSize: 12,
              cursor: "pointer",
              margin: `2em 2em 0 0`,
              paddingBottom: 5,
            }}
          >
            <div onClick={() => setGoToAction({ path: link_url, actions })}>
              <Html2React html={label} />
            </div>
          </div>
        );
      };

      return (
        <Accordion.Body
          style={{
            borderTop: `1px solid ${colors.darkSilver}`,
            margin: `0 1.25em`,
            padding: `1em 0`,
          }}
        >
          <ServeBody />
          <ServeLTBody />

          <ServeLTTeam />
          <ServeGSSubTitle />
          <div className="flex-row" style={{ width: "50%", flexWrap: "wrap" }}>
            {gsLinks &&
              gsLinks.map((link, key) => {
                return <ServeLink key={key} link={link} />;
              })}
          </div>
          <ServeDownloads />
          <ServeGoToPage />
        </Accordion.Body>
      );
    };

    return (
      <Accordion>
        <Accordion.Item
          eventKey={eventKey}
          className="shadow"
          style={{ padding: `0.5em 1em`, margin: `1em 0` }}
        >
          <ServeHeader />
          <ServeContent />
        </Accordion.Item>
      </Accordion>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className="text-body"
      style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}
    >
      {block.accordion_item.map((block, key) => {
        const blockId = uuidv4(); // add unique id

        return <ServeAccordion key={key} eventKey={blockId} block={block} />;
      })}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    gap: 20,
  },
  divider: {
    margin: `2px 0.5em`,
    borderRight: `1px solid ${colors.darkSilver}`,
  },
  listLayout: {
    display: "grid",
    gridTemplateColumns: `25% auto`,
    gap: 20,
    padding: `0.5em 0`,
  },
  profileLayout: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
    padding: `3em 0 0`,
  },
  previewIcon: {
    fontSize: 12,
    textTransform: "uppercase",
    height: "100%",
  },
};

export default connect(AccordionComponent);
