import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import IndexCard from "./indexCard";
import Loading from "./loading";
import { setGoToAction } from "../context";

const SplitContentAndIndexCard = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    body,
    label,
    link,
    index_card,
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
      const MAX_LENGTH = 800;
      let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
      if (limit) BODY = bodyPreview;

      const ServeActions = () => {
        if (!limit_body_length) return null;

        let label = "Read More";
        if (!limit) label = "Read Less";

        return (
          <div style={{ padding: `2em 0` }}>
            <div className="caps-btn" onClick={() => setLimit(!limit)}>
              {label}
            </div>
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
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: colors.primary, color: colors.white }}
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <Html2React html={label} />
          </button>
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
    if (!index_card) return null;

    return (
      <div>
        {index_card.map((block, key) => {
          const { card_title, colour, index_title, link, subtitle } = block;

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
              <IndexCard
                card_title={card_title}
                colour={colour}
                index_title={index_title}
                subtitle={subtitle}
                link={link}
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

export default connect(SplitContentAndIndexCard);
