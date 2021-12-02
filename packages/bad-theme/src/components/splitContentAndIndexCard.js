import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import IndexCard from "./indexCard";
import Loading from "./loading";

const ServeBlockTitle = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { body, title, label, link, index_card } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ path }) => {
    actions.router.set(path);
  };

  // SERVERS -----------------------------------------------------
  const ServeContent = () => {
    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          <Html2React html={title} />
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      return (
        <div
          style={{
            fontSize: 16,
          }}
        >
          <Html2React html={body} />
        </div>
      );
    };

    const ServeLink = () => {
      if (!label && !link) return null;

      return (
        <div
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
            onClick={() =>
              handleGoToPath({
                path: link.url,
              })
            }
          >
            <Html2React html={label} />
          </button>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
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
                position: "sticky",
                top: 0,
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

export default connect(ServeBlockTitle);
