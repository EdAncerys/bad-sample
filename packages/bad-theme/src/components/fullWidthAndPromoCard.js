import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const FullWidthAndPromoCard = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { body, colour, image, disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex">
        <div className="flex">
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

export default connect(FullWidthAndPromoCard);
