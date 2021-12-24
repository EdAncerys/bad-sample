import { connect } from "frontity";
import { colors } from "../config/imports";

import { setGoToAction } from "../context";

const UsefulLinksCard = ({
  state,
  actions,
  libraries,
  colour,
  link_title,
  shadow,
  cardWidth,
  cardHeight,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!link_title) return null;

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

  const ServeIndexTitle = ({ block }) => {
    const { label, title, link } = block;

    if (!title && !label) return null;

    const ServeLabel = () => {
      return (
        <div
          className="flex"
          style={{ justifyContent: "flex-start", padding: `2em 0` }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              padding: 10,
              backgroundColor: colors.lightSilver,
            }}
          >
            <Html2React html={label} />
          </div>
        </div>
      );
    };

    const ServeTitle = () => {
      return (
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            color: colors.black,
            textTransform: "capitalize",
            cursor: "pointer",
          }}
          onClick={() => setGoToAction({ path: link.url, actions })}
        >
          <Html2React html={title} />
        </div>
      );
    };

    return (
      <div
        style={{
          borderBottom: `1px dotted ${colors.darkSilver}`,
          padding: `1em 0`,
        }}
      >
        <ServeLabel />
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
        <div style={{ fontSize: 20, color: colors.black }}>Useful Links</div>
        <div className="list-group">
          {link_title.map((block, key) => {
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

export default connect(UsefulLinksCard);
