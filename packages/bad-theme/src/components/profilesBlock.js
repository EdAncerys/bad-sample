import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "./profile";
import { colors } from "../config/imports";
import Loading from "./loading";
import { setGoToAction } from "../context";

const ProfilesBlock = ({ state, actions, libraries, block }) => {
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
        <button
          className="btn"
          style={{
            fontSize: 16,
            textTransform: "capitalize",
            color: colors.white,
            backgroundColor: colors.primary,
          }}
          onClick={() => setGoToAction({ path: link.url, actions })}
        >
          <Html2React html={label} />
        </button>
      </div>
    );
  };

  const ServeTitle = () => {
    return (
      <div className="flex">
        <div
          className="primary-title"
          style={{
            fontSize: 36,
            color: colors.black,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
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
      <div style={styles.container}>
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
};

export default connect(ProfilesBlock);
