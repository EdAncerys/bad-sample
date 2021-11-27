import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const FundingPromo = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;
  if (!block.card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    const ServeTitle = () => {
      if (!block.title) return null;

      return (
        <div
          className="flex"
          style={{
            fontSize: 36,
            fontWeight: "bold",
            justifyContent: "center",
          }}
        >
          <Html2React html={block.title} />
        </div>
      );
    };
    const ServeBody = () => {
      if (!block.body) return null;

      return (
        <div
          className="flex"
          style={{
            fontSize: 16,
            textAlign: "center",
            padding: `1em 0`,
          }}
        >
          <Html2React html={block.body} />
        </div>
      );
    };

    return (
      <div
        className="flex-col"
        style={{
          justifyContent: "center",
          padding: `0 6em 2em`,
        }}
      >
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <ServeContent />
      <div style={styles.container}>
        {block.card.map((block, key) => {
          const { amount, body, colour, deadline, file, label, title } = block;

          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                fundingPromo={{ title, amount, deadline }}
                body={body}
                downloadFile={{ file, title: label }}
                colour={colour}
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
};

export default connect(FundingPromo);
