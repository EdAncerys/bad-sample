import { connect } from "frontity";

import { colors } from "../config/colors";
import { setGoToAction } from "../context";

const IndexCard = ({
  state,
  actions,
  libraries,
  card_title,
  colour,
  index_title,
  subtitle,
  shadow,
  cardWidth,
  cardHeight,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!index_title) return null;

  const SHADOW = shadow ? "shadow" : "";
  const THEME = colour || colors.primary;

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeContent = () => {
    const ServeTitle = () => {
      if (!card_title) return null;

      return (
        <div style={{ fontSize: 20, fontWeight: "bold", color: colors.black }}>
          <Html2React html={card_title} />
        </div>
      );
    };

    const ServeSubtile = () => {
      if (!subtitle) return null;

      return (
        <div style={{ fontSize: 16, fontWeight: "bold", padding: `1em 0` }}>
          <Html2React html={subtitle} />
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
        <ServeSubtile />
      </div>
    );
  };

  const ServeIndexTitle = ({ block }) => {
    const { title, link_id, link } = block;

    const ServeTitle = () => {
      if (!title) return null;

      const ServeReference = () => {
        if (!link_id) return null;

        const handleGoToRef = () => {
          document.location = `index.html#${link_id}`;
        };

        return (
          <a href={`#${link_id}`}>
            <Html2React html={title} />
          </a>
        );
      };

      const ServeGoToPage = () => {
        if (!link || link_id) return null;

        return (
          <div onClick={() => setGoToAction({ path: link.url, actions })}>
            <Html2React html={title} />
          </div>
        );
      };

      return (
        <div
          className="list-group-block"
          style={{
            padding: `0.5em 0`,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              borderBottom: `1px dotted ${colors.darkSilver}`,
              textTransform: "capitalize",
            }}
          >
            <ServeReference />
            <ServeGoToPage />
          </div>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className={SHADOW}
      style={{
        ...styles.card,
        width: cardWidth || "100%",
        height: cardHeight || "100%",
      }}
    >
      <div style={{ padding: `2em 1em` }}>
        <div className="list-group index-card">
          <ServeContent />
          {index_title.map((block, key) => {
            return <ServeIndexTitle key={key} block={block} />;
          })}
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.white,
    overflow: "hidden",

    position: "sticky",
    top: 0,
  },
};

export default connect(IndexCard);
