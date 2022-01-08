import { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Accordion from "react-bootstrap/Accordion";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { v4 as uuidv4 } from "uuid";

import DownloadFileBlock from "../downloadFileBlock";
import Loading from "../loading";
import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import AccordionHeader from "./accordionHeader";

const AccordionComponent = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
}) => {
  if (!block) return <Loading />;

  const { disable_vertical_padding, accordion_item } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const LOGO_HEIGHT = 45;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block }) => {
    const [uniqueId, setUniqueId] = useState(null);
    // hook applies after React has performed all DOM mutations
    useLayoutEffect(() => {
      const blockId = uuidv4(); // add unique id
      setUniqueId(blockId);
    }, []);

    if (!uniqueId) return <Loading />;

    const ALL_POSITIONS = Object.values(state.source.leadership_position);
    const {
      title,
      body,
      logo,
      downloads,
      label,
      link,
      has_preview,
      file_submit_option,
      recipients,
      guidelines_type,
    } = block;

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
      // const addIcon = document.querySelector(`#add-id-${uniqueId}`);
      // const removeIcon = document.querySelector(`#remove-id-${uniqueId}`);
      // const moreIcon = document.querySelector(`#more-id-${uniqueId}`);
      // const lessIcon = document.querySelector(`#less-id-${uniqueId}`);
      // const preview = document.querySelector(`#preview-id-${uniqueId}`);
      // // apply toggle to selected components
      // if (preview) {
      //   preview.classList.toggle("d-none");
      // }
      // if (addIcon) {
      //   addIcon.classList.toggle("d-none");
      // }
      // if (removeIcon) {
      //   if (removeIcon.classList.contains("d-none")) {
      //     removeIcon.classList.remove("d-none");
      //   } else {
      //     removeIcon.classList.add("d-none");
      //   }
      // }
      // if (moreIcon) {
      //   moreIcon.classList.toggle("d-none");
      // }
      // if (lessIcon) {
      //   if (lessIcon.classList.contains("d-none")) {
      //     lessIcon.classList.remove("d-none");
      //   } else {
      //     lessIcon.classList.add("d-none");
      //   }
      // }
    };

    // SERVERS ----------------------------------------------------
    const ServeContent = () => {
      const ServeGSSubTitle = () => {
        if (!gsSubtitle) return null;

        return (
          <div className="flex">
            <Html2React html={gsSubtitle} />
          </div>
        );
      };

      const ServeGSLink = () => {
        if (!gsLinks) return null;

        return (
          <div className="flex-row" style={{ width: "50%", flexWrap: "wrap" }}>
            {gsLinks.map((link, key) => {
              return <ServeLink key={key} link={link} />;
            })}
          </div>
        );
      };

      const ServeDownloads = () => {
        if (!gsDocument_uploads && !downloads) return null;

        const files = gsDocument_uploads || downloads;

        return (
          <div className="flex-col">
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
            <div className="flex-col" style={{ flexWrap: "wrap" }}>
              {files.map((block, key) => {
                return (
                  <div
                    className="flex"
                    key={key}
                    style={{ padding: `1em 1em 1em 0` }}
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
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              padding: `1em 0`,
            }}
          >
            <div>
              <button
                className="flex-row blue-btn"
                onClick={() => setGoToAction({ path: link.url, actions })}
              >
                <div className="flex">
                  <Html2React html={LABEL} />
                </div>
                <div style={{ margin: "auto 0" }}>
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

      const ServeFileSubmit = () => {
        if (!file_submit_option) return null;

        return (
          <div>
            <div
              className="flex"
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                paddingBottom: `1em`,
              }}
            >
              <div>
                <button
                  className="flex-row blue-btn"
                  onClick={() => console.log("file upload")}
                >
                  <div className="flex">Apply Here</div>
                  <div style={{ margin: "auto 0" }}>
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
          </div>
        );
      };

      const ServeBody = () => {
        if (!body) return null;

        return (
          <div className="text-body">
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
          const positionId = item.leadership_position;

          const ServeTitle = () => {
            if (!title) return null;

            return (
              <div className="primary-title">
                <Html2React html={title} />
              </div>
            );
          };

          const ServePosition = () => {
            if (!positionId[0]) return null;

            const positionData = ALL_POSITIONS.filter(
              (position) => position.id === positionId[0]
            );
            const positionName = positionData[0].name;

            return (
              <div>
                <Html2React html={positionName} />
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
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <ServeCardImage />
              <ServeTitle />
              <ServePosition />
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
            <div>
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
          <div style={{ margin: `2em 2em 0 0` }}>
            <div
              className="caps-btn"
              onClick={() => setGoToAction({ path: link_url, actions })}
            >
              <Html2React html={label} />
            </div>
          </div>
        );
      };

      let COLUMNS = `3fr 1fr`;
      if (!gsDocument_uploads && !downloads) COLUMNS = `1fr`;

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
          <ServeGSLink />
          <div
            style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: 20 }}
          >
            <ServeDownloads />
            <div className="flex-col">
              <ServeGoToPage />
              <ServeFileSubmit />
            </div>
          </div>
        </Accordion.Body>
      );
    };

    return (
      <Accordion>
        <Accordion.Item
          eventKey={uniqueId}
          id={uniqueId}
          className="shadow"
          style={{ padding: `0.5em 1em`, margin: `1em 0` }}
        >
          <AccordionHeader
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            handleAccordionToggle={handleAccordionToggle}
            uniqueId={uniqueId}
          />
          <ServeContent />
        </Accordion.Item>
      </Accordion>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      {accordion_item.map((block, key) => {
        return <ServeAccordion key={key} block={block} />;
      })}
    </div>
  );
};

const styles = {
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
  },
  previewIcon: {
    fontSize: 12,
    textTransform: "uppercase",
    height: "100%",
  },
};

export default connect(AccordionComponent);
