import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "./profile";
import { colors } from "../config/colors";
import { DATA } from "../config/data";

const ProfilesBlock = ({ state, actions, style, data }) => {
  const array = data || DATA; // TBD

  // SERVERS ------------------------------------------------------
  const ServeActions = () => {
    // HELPERS ----------------------------------------------------
    const handleGoToAction = () => {
      actions.router.set(`/go-to-url`);
    };

    return (
      <div className="flex-center-row">
        <button
          className="btn m-4"
          style={{
            fontSize: 16,
            textTransform: "capitalize",
            color: colors.white,
            backgroundColor: colors.blue,
          }}
          onClick={handleGoToAction}
        >
          <span>View Team</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex" style={styles.container}>
        {array.map((item) => {
          return <Profile key={item.id} item={item} />;
        })}
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
};

export default connect(ProfilesBlock);
