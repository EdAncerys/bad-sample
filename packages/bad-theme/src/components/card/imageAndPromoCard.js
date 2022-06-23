import { connect } from "frontity";
import Image from "@frontity/components/image";
import parse from "html-react-parser";

// --------------------------------------------------------------------------------
import { setGoToAction, muiQuery, Parcer } from "../../context";

const ImageAndPromoCard = ({
  state,
  actions,
  libraries,
  imageAndPromoCard,
}) => {
  if (!imageAndPromoCard) return null;

  const { sm, md, lg, xl } = muiQuery();

  const { body, image, link, label, title } = imageAndPromoCard;

  // SERVERS ---------------------------------------------
  const ServeMoreAction = () => {
    if (!link) return null;
    let GO_TO_LABEL = "More";
    if (label) GO_TO_LABEL = label;

    return (
      <div onClick={() => setGoToAction({ state, path: link.url, actions })}>
        <div value={parse(GO_TO_LABEL)} className="caps-btn">
          <Parcer libraries={libraries} html={GO_TO_LABEL} />
        </div>
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div className="primary-title" style={{ fontSize: 20 }}>
        <Parcer libraries={libraries} html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div style={{ padding: `1em 0` }}>
        <Parcer libraries={libraries} html={body} />
      </div>
    );
  };

  const ServeContent = () => {
    if (!body) return null;

    return (
      <div className="flex-col" style={{ padding: !lg ? `2em` : `1em` }}>
        <div className="flex-col">
          <ServeTitle />
          <ServeBody />
        </div>
        <ServeMoreAction />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!image) return null;
    const alt = "BAD";

    return (
      <div style={{ width: "100%", maxHeight: 300 }}>
        <Image
          src={image.url}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: !lg ? `repeat(2, 1fr)` : `repeat(1, 1fr)`,
        gap: !lg ? 20 : 0,
      }}
    >
      <ServeCardImage />
      <ServeContent />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ImageAndPromoCard);
