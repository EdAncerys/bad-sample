import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "./profile";
import { DATA } from "../config/data";

const ProfilesBlock = ({ state, actions, style, data }) => {
  const array = data || DATA; // TBD

  return (
    <div>
      <div className="flex" style={{ ...style }}>
        {array.map((item) => {
          return <Profile key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ProfilesBlock);
