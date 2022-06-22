import { connect } from "frontity";
import { colors } from "../config/imports";

// CONTEXT ----------------------------------------------------
import { setGoToAction, Parcer } from "../context";

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
          style={{ justifyContent: "flex-start", paddingBottom: `1em` }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              padding: "0.5em",
              backgroundColor: colors.lightSilver,
            }}
          >
            <Parcer libraries={libraries} html={label} />
          </div>
        </div>
      );
    };

    const ServeTitle = () => {
      return (
        <div
          className="primary-title title-link-animation"
          // className="primary-title title-link"
          style={{
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => setGoToAction({ state, path: link.url, actions })}
        >
          <Parcer libraries={libraries} html={title} />
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
        <div className="primary-title" style={{ fontSize: 20 }}>
          Useful Links
        </div>
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
