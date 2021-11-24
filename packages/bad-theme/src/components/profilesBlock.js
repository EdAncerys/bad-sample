import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "./profile";
import { colors } from "../config/colors";
import Loading from "./loading";

const ProfilesBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.profile_card) return null;

  const { label, link, title } = block;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ------------------------------------------------------
  const ServeActions = () => {
    // HELPERS ----------------------------------------------------
    const handleGoToAction = () => {
      if (!link.url) return null;
      actions.router.set(`${link.url}`);
    };

    return (
      <div className="flex-center-row">
        <button
          className="btn"
          style={{
            fontSize: 16,
            textTransform: "capitalize",
            color: colors.white,
            backgroundColor: colors.primary,
          }}
          onClick={handleGoToAction}
        >
          <div>{label}</div>
        </button>
      </div>
    );
  };

  const ServeTitle = () => {
    return (
      <div className="flex">
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {title}
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
