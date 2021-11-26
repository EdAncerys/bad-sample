import { connect } from "frontity";
import { useState, useEffect } from "react";
import { colors } from "../config/colors";
import Accordion from "react-bootstrap/Accordion";

import Loading from "./loading";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AccordionComponent = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;
  if (!block.accordion_item) return null;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block, eventKey }) => {
    const [active, setActive] = useState(null);
    const hasPreview = block.preview === "true";

    const { title, body } = block;
    if (!title) return null;

    const ServeTitle = () => {
      if (!title) return null;

      const ServeTitle = () => {
        return (
          <div
            className="flex"
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            <div className="flex">
              <Html2React html={title} />
            </div>
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
        if (hasPreview) return null;
        if (active) return null;

        // Manage max string Length
        const MAX_LENGTH = 155;
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

      const ServeIcon = () => {
        if (hasPreview) {
          if (!active) return <AddIcon style={{ fill: colors.textMain }} />;
          if (active) return <RemoveIcon style={{ fill: colors.textMain }} />;
        }
        if (!hasPreview) {
          if (!active)
            return (
              <div style={{ fontSize: 12, textTransform: "uppercase" }}>
                See More
              </div>
            );
          if (active)
            return (
              <div style={{ fontSize: 12, textTransform: "uppercase" }}>
                Less
              </div>
            );
        }
      };

      return (
        <div style={{ position: "relative" }}>
          <Accordion.Header>
            <div className="flex" style={{ paddingTop: `1em` }}>
              <ServeTitle />
              <ServeIcon />
            </div>
          </Accordion.Header>
          <ServeDivider active={active} />
          <ServePreview />
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      return (
        <Accordion.Body>
          <div
            style={{
              fontSize: 16,
              color: colors.darkSilver,
            }}
          >
            <Html2React html={body} />
          </div>
        </Accordion.Body>
      );
    };

    return (
      <Accordion>
        <Accordion.Item
          eventKey={eventKey}
          className="shadow"
          style={{ margin: "10px 0" }}
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
  container: {},
};

export default connect(AccordionComponent);
