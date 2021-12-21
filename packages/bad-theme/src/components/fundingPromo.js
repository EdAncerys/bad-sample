import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/colors";

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
            fontFamily: "Roboto",
            fontWeight: "bold",
            justifyContent: "center",
            color: colors.black,
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
          const {
            amount,
            body,
            colour,
            deadline,
            file,
            label,
            title,
            link_label,
            link,
          } = block;

          console.log("----", block);
          return (
            <div key={key} className="flex">
              <Card
                fundingPromo={{ title, amount, deadline }}
                body={body}
                downloadFile={file ? { file, title: label } : null}
                link_label={link_label}
                link={link.url}
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
