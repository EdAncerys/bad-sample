import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const NewsArticles = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let CARD_NUMBER = 3;
  if (block.cards_per_row === "One") CARD_NUMBER = 1;
  if (block.cards_per_row === "Two") CARD_NUMBER = 2;
  if (block.cards_per_row === "Four") CARD_NUMBER = 4;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CARD_NUMBER}, 1fr)`,
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {block.card.map((block, key) => {
          const { body, news_title, colour, date, icon, label, link, title } =
            block;

          return (
            <div key={key} className="flex">
              <Card
                newsArticle={{ news_title, date, icon }}
                title={title}
                body={body}
                colour={colour}
                label={label}
                link={link.url}
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
  container: {},
};

export default connect(NewsArticles);
