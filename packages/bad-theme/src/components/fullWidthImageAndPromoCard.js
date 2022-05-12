import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

// CONTEXT -------------------------------------
import { setGoToAction } from "../context";

const FullWidthImageAndPromoCard = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { body, colour, image, disable_vertical_padding, link } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}
      data-aos="fade"
      data-aos-easing="ease-in-sine"
      data-aos-delay="100"
      data-aos-duration="1000"
    >
      <div className="flex">
        <div
          className={`flex card-wrapper`}
          onClick={() => setGoToAction({ state, path: link.url, actions })}
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
