import { connect } from "frontity";
import { colors } from "../config/colors";

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
        <div style={{ fontSize: 20, fontWeight: "bold" }}>
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
    const { title, link_id } = block;

    if (!title) return null;

    const ServeTitle = () => {
      return (
        <div
          className="list-group-block"
          style={{ padding: `0.5em 0`, cursor: "pointer" }}
        >
          <div
            style={{
              borderBottom: `1px dotted ${colors.darkSilver}`,
              textTransform: "capitalize",
            }}
          >
            <a href={`#${link_id}`}>
              <Html2React html={title} />
            </a>
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
        <div className="list-group">
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
