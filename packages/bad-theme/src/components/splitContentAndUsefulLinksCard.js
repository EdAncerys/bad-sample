import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import { setGoToAction } from "../context";

import Loading from "./loading";
import UsefulLinksCard from "./usefulLinksCard";
import TitleBlock from "./titleBlock";

const SplitContentAndUsefulLinksCard = ({
  state,
  actions,
  libraries,
  block,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    body,
    title,
    label,
    link,
    useful_link_card,
    disable_vertical_padding,
    limit_body_length,
  } = block;

  const [limit, setLimit] = useState(limit_body_length);
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS -----------------------------------------------------
  const ServeContent = () => {
    const ServeBody = () => {
      if (!body) return null;

      // Manage max string Length
      let BODY = body;
      const MAX_LENGTH = 1600;
      let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
      if (body.length < MAX_LENGTH) bodyPreview = body;
      if (limit) BODY = bodyPreview;

      const ServeActions = () => {
        if (!limit_body_length) return null;

        let label = "Read More";
        if (!limit) label = "Read Less";

        return (
          <div style={{ padding: `2em 0` }}>
            <div
              value={label}
              className="caps-btn"
              onClick={() => setLimit(!limit)}
            >
              {label}
            </div>
          </div>
        );
      };

      const ServeTitle = () => {
        if (!title) return null;

        return (
          <div className="text-body-no-margin">
            <TitleBlock block={{ title, text_align: "left" }} disableMargin />
          </div>
        );
      };

      return (
        <div
          className="text-body"
          style={{
            fontSize: 16,
          }}
        >
          <ServeTitle />
          <Html2React html={BODY} />
          <ServeActions />
        </div>
      );
    };

    const ServeLink = () => {
      if (!label && !link) return null;

      return (
        <div
          className="primary-title"
          style={{
            fontSize: 24,
            fontWeight: "bold",
            paddingTop: `1em`,
          }}
        >
          <div
            className="blue-btn"
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <Html2React html={label} />
          </div>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeBody />
        <ServeLink />
      </div>
    );
  };

  const ServeIndexCard = ({}) => {
    if (!useful_link_card) return null;

    return (
      <div>
        {useful_link_card.map((block, key) => {
          const { colour, link_title } = block;

          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: `1em`,
                // add sticky config to side component
                // position: "sticky",
                // top: 0,
              }}
            >
              <UsefulLinksCard
                colour={colour}
                link_title={link_title}
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        <ServeContent />
        <ServeIndexCard />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `2fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
  },
};

export default connect(SplitContentAndUsefulLinksCard);
