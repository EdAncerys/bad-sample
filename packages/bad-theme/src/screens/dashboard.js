import { useState } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";

import Profile from "../components/dashboard/profile";
import ProfileProgress from "../components/dashboard/profileProgress";
import UpdateProfileAction from "../components/dashboard/updateProfileAction";

import BlockWrapper from "../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppState();
  console.log(user);

  // if (!user) actions.router.set(`https://badadmin.skylarkdev.co`);

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  return (
    <div>
      <BlockWrapper>
        <div
          style={{
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <div className="flex-col" style={{ justifyContent: "center" }}>
            <Profile />
            <ProfileProgress />
            <UpdateProfileAction />
          </div>
        </div>
      </BlockWrapper>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
