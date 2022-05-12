import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

// CONTEXT --------------------------------------------------
import { muiQuery } from "../context";

const NewsArticles = ({ state, actions, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  if (!block) return <Loading />;
  if (!block.card) return null;

  const { disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

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
          gridTemplateColumns: !lg
            ? `repeat(${CARD_NUMBER}, 1fr)`
            : "repeat(1, 1fr)",
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
                link_label={label}
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
