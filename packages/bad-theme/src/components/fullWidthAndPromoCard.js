import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const FullWidthAndPromoCard = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { body, colour, image } = block;

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
