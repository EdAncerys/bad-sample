import { connect } from "frontity";

import Profile from "./profile";
import Loading from "./loading";

// CONTEXT --------------------------------------------------
import { setGoToAction, muiQuery } from "../context";

const ProfilesBlock = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;
  if (!block.profile_card) return null;

  const { label, link, title, disable_vertical_padding } = block;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ------------------------------------------------------
  const ServeActions = () => {
    if (!label.length) return null;

    return (
      <div className="flex-center-row" style={{ paddingTop: `1em` }}>
        <div
          className="blue-btn"
          onClick={() => setGoToAction({ state, path: link.url, actions })}
        >
          <Html2React html={label} />
        </div>
      </div>
    );
  };

  const ServeTitle = () => {
    return (
      <div className="flex">
        <div
          className="primary-title"
          style={{ fontSize: 26, textTransform: "capitalize" }}
        >
          <Html2React html={title} />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex-col"
      style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}
    >
      <ServeTitle />
      <div style={!lg ? styles.container : styles.containerMobile}>
        {block.profile_card.map((block, key) => {
          return <Profile key={key} block={block} />;
        })}
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-between",
    gap: 15,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    justifyContent: "space-between",
    gap: 15,
  },
};

export default connect(ProfilesBlock);
