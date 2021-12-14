import { connect } from "frontity";
import { useState, useEffect } from "react";
import { colors } from "../config/colors";
import Accordion from "react-bootstrap/Accordion";
import Image from "@frontity/components/image";

import Loading from "./loading";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DownloadFileBlock from "./downloadFileBlock";
import { setGoToAction } from "../context";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const AccordionComponent = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;
  if (!block.accordion_item) return null;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block, eventKey }) => {
    const [active, setActive] = useState(null);
    const hasPreview = block.preview === "true";

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
    } = block;
    if (!title) return null;

    const ServeDate = () => {
      if (!date) return null;

      const ServeEventOrganizer = () => {
        if (!update_in_progress) return null;

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
            Published <Html2React html={date} />
          </div>
          <ServeEventOrganizer />
        </div>
      );
    };

    const ServeTitle = () => {
      if (!title) return null;

      const ServeTitle = () => {
        return (
          <div
            className="flex"
            style={{
              fontSize: 20,
              color: colors.black,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            <Html2React html={title} />
            <ServeDate />
          </div>
        );
      };

      const ServeDivider = ({ active }) => {
        if (!active) return null;

        return (
          <div
            style={{
              margin: `0 1.25em`,
              borderTop: `1px solid ${colors.darkSilver}`,
            }}
          />
        );
      };

      const ServePreview = () => {
        if (!hasPreview) return null;
        if (active) return null;

        // Manage max string Length
        const MAX_LENGTH = 140;
        let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
        if (body.length < MAX_LENGTH) bodyPreview = body;

        return (
          <div>
            <ServeDivider active />
            <div
              style={{
                fontSize: 16,
                margin: `0 1.25em`,
                padding: `1em 0`,
                color: colors.darkSilver,
              }}
            >
              <Html2React html={bodyPreview} />
            </div>
          </div>
        );
      };

      const ServeLogo = () => {
        if (!logo) return null;
        const alt = logo.title || "BAD";

        return (
          <div
            style={{
              width: 120,
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
                objectFit: "cover",
              }}
            />
          </div>
        );
      };

      const ServeIcon = () => {
        if (!hasPreview) {
          if (!active)
            return <AddIcon style={{ fontSize: 48, fill: colors.textMain }} />;
          if (active)
            return (
              <RemoveIcon style={{ fontSize: 48, fill: colors.textMain }} />
            );
        }
        if (hasPreview) {
          if (!active)
            return (
              <div>
                <div
                  className="flex"
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    height: "100%",
                  }}
                >
                  See More
                </div>
              </div>
            );
          if (active)
            return (
              <div>
                <div
                  className="flex"
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    height: "100%",
                  }}
                >
                  Less
                </div>
              </div>
            );
        }
      };

      return (
        <div style={{ position: "relative" }}>
          <Accordion.Header>
            <div
              className="flex"
              style={{ margin: 0, padding: `0.5em 0`, alignItems: "center" }}
            >
              <ServeTitle />
              <ServeLogo />
              <ServeIcon />
            </div>
          </Accordion.Header>
          <ServeDivider active={active} />
          <ServePreview />
        </div>
      );
    };

    const ServeDownloads = () => {
      if (!downloads) return null;

      return (
        <div className="flex-col" style={{ width: "70%" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              padding: `1em 0`,
            }}
          >
            Downloads:
          </div>
          <div className="flex" style={{ flexWrap: "wrap" }}>
            {downloads.map((block, key) => {
              return (
                <div
                  key={key}
                  style={{ minWidth: "33%", padding: `1em 1em 1em 0` }}
                >
                  <DownloadFileBlock block={block} disableMargin />
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const ServeGoToPage = () => {
      if (!link) return null;

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

    const ServeGuidelines = () => {
      if (!link_to_pil) return null;

      return (
        <div
          style={{
            borderBottom: `1px solid ${colors.darkSilver}`,
            textTransform: "uppercase",
            fontSize: 12,
            cursor: "pointer",
            marginRight: `2em`,
            paddingBottom: 5,
          }}
        >
          <div
            onClick={() => setGoToAction({ path: link_to_pil.url, actions })}
          >
            Read guideline
          </div>
        </div>
      );
    };

    const ServeDOI = () => {
      if (!doi) return null;

      return (
        <div
          style={{
            borderBottom: `1px solid ${colors.darkSilver}`,
            textTransform: "uppercase",
            fontSize: 12,
            cursor: "pointer",
            marginRight: `1em`,
            paddingBottom: 5,
          }}
        >
          <div onClick={() => setGoToAction({ path: doi.url, actions })}>
            Patient Information Leaflet
          </div>
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      return (
        <Accordion.Body>
          <div className="text-body">
            <Html2React html={body} />
          </div>
          <div style={{ width: "50%" }}>
            <div className="flex-row" style={{ padding: `1em 0` }}>
              <ServeGuidelines />
              <ServeDOI />
            </div>
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
          onClick={() => setActive(!active)}
        >
          <ServeTitle />
          <ServeBody />
        </Accordion.Item>
      </Accordion>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      {block.accordion_item.map((block, key) => {
        return <ServeAccordion key={key} eventKey={key} block={block} />;
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
};

export default connect(AccordionComponent);
