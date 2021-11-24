import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Accordion from "react-bootstrap/Accordion";

import Loading from "./loading";

const AccordionComponent = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;
  if(!block.accordion_item) return null;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ---------------------------------------------
  const ServeDivider = () => {
    return (
      <div
        className="flex"
        style={{
          position: "relative",
          zIndex: 9,
          width: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            backgroundColor: colors.silver,
            height: 1,
            width: "100%",
          }}
        />
      </div>
    );
  };

  const ServeCardBody = ({ block, eventKey }) => {
    const { title, body } = block;
    if (!title) return null;

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div style={{ position: "relative" }}>
          <Accordion.Header>
            <Html2React html={title} />
          </Accordion.Header>
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      return (
        <Accordion.Body>
          <ServeDivider />
          <Html2React html={body} />
        </Accordion.Body>
      );
    };

    return (
      <Accordion.Item
        eventKey={eventKey}
        className="shadow"
        style={{ margin: "10px 0" }}
      >
        <ServeTitle />
        <ServeBody />
      </Accordion.Item>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <Accordion>
        {block.accordion_item.map((block, key) => {
          return <ServeCardBody key={key} eventKey={key} block={block} />;
        })}
      </Accordion>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccordionComponent);
