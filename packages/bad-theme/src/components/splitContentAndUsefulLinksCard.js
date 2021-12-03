import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import UsefulLinksCard from "./usefulLinksCard";
import Loading from "./loading";
import { setGoToAction } from "../context";

const SplitContentAndUsefulLinksCard = ({
  state,
  actions,
  libraries,
  block,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { body, label, link, useful_link_card } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS -----------------------------------------------------
  const ServeContent = () => {
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
                position: "sticky",
                top: 0,
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
