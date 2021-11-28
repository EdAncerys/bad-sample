import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const MultiPostBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
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
            <div
              key={key}
              className="flex"
              style={{
                // add custom wrapping to card elements
                // width: "30%",
                // margin: `0 1em 1em`,
              }}
            >
              <Card
                cardTitle={card_title}
                title={title}
                body={body}
                colour={colour}
                link={link.url}
                url={background_image.url} // optional param
                form_link={form_link.url} // optional param
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

    // add custom wrapping to card elements
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "center",
  },
};

export default connect(MultiPostBlock);
