import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";
// CONTEXT -------------------------------------
import { setGoToAction } from "../context";

const FullWidthImageAndPromoCard = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { body, colour, image, disable_vertical_padding, link } = block;
  console.log("promo card", block);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // HANDLERS ---------------------------------------------
  const handleCardAction = () => {
    if (link) {
      setGoToAction({ path: link.url, actions });
    }
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex">
        <div
          className={`flex ${link ? "card-wrapper" : ""}`}
          onClick={handleCardAction}
        >
          <Card
            imageAndPromoCard={block}
            colour={colour}
            removePadding
            shadow // optional param
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FullWidthImageAndPromoCard);
