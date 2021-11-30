import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const MultiPostBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let CARD_NUMBER = 3;
  if (block.cards_per_row === "One") CARD_NUMBER = 1;
  if (block.cards_per_row === "Two") CARD_NUMBER = 2;
  if (block.cards_per_row === "Four") CARD_NUMBER = 4;

  const isFrom4Col = CARD_NUMBER === 4;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CARD_NUMBER}, 1fr)`,
          justifyContent: "space-between",
          gap: isFrom4Col ? 10 : 20,
        }}
      >
        {block.card.map((block, key) => {
          const {
            background_image,
            body,
            card_title,
            colour,
            form_link,
            link,
            title,
          } = block;

          return (
            <div key={key} className="flex">
              <Card
                cardTitle={isFrom4Col ? null : card_title}
                title={title}
                body={body}
                colour={colour}
                link={link.url}
                url={isFrom4Col ? null : background_image.url} // optional param
                form_link={form_link.url} // optional param
                cardHeight={isFrom4Col ? 290 : null}
                isFrom4Col={isFrom4Col ? true : null}
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
    // add custom wrapping to card elements
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "center",
  },
};

export default connect(MultiPostBlock);
