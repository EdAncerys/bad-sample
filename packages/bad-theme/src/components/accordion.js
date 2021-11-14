import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Accordion from "react-bootstrap/Accordion";

import Loading from "./loading";

const Card = ({ state, actions, item }) => {
  if (!item) return <Loading />;

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

  const ServeCardBody = ({ item }) => {
    const { title, body } = item;
    if (!title) return null;

    const ServeTitle = () => {
      if (!title) return null;

      // Manage max string Length
      const MAX_LENGTH = 100;
      let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
      if (title.length < MAX_LENGTH) titlePreview = title;

      return (
        <div style={{ position: "relative" }}>
          <Accordion.Header>{titlePreview}</Accordion.Header>
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      // Manage max string Length
      const MAX_LENGTH = 300;
      let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
      if (body.length < MAX_LENGTH) bodyPreview = body;

      return (
        <Accordion.Body>
          <ServeDivider />
          {bodyPreview}
        </Accordion.Body>
      );
    };

    return (
      <Accordion.Item
        eventKey={item.id}
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
    <div>
      <Accordion>
        {item.map((item) => {
          return <ServeCardBody key={item.id} item={item} />;
        })}
      </Accordion>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Card);
