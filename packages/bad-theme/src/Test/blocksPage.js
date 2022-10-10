import React, { useEffect } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
// --------------------------------------------------------------------------------
import {
  Parcer,
  getMembershipTypes,
  useAppState,
  getUserStoreAction,
} from "../context";
// --------------------------------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const BlocksPage = ({ state, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  const { applicationData, isActiveUser } = useAppState();

  // 📌 if env is dev, show the blocks.
  if (state.auth.ENVIRONMENT !== "DEV") return null;
  let title = [];

  useEffect(() => {
    if (!isActiveUser) return null; // async user data fetch from Dynamics. If no user break

    // async fetch handler
    (async () => {
      try {
        const appTypes = await getMembershipTypes({ state });
        const userApp = await getUserStoreAction({ state, isActiveUser });
        console.log("appTypes: ", appTypes);
        console.log("userApp: ", userApp);

        const bad_categorytype = userApp?.[0]?.bad_categorytype
          ?.toLowerCase()
          ?.replace(/\s/g, "");
        const bad_organisedfor = userApp?.[0]?.bad_organisedfor;

        console.log("🐞 app", bad_categorytype, bad_organisedfor);

        // map threough appTypes and find the app type that matches the user app type
        const wpAppType = appTypes.find((app) => {
          // get application & strip all white spaces and make lowercase and replace - with ''
          const application = app?.slug
            ?.toLowerCase()
            ?.replace(/\s/g, "")
            ?.replace(/-/g, "");

          // return memberships that matches or includes any words in applicationType
          return application?.includes(bad_categorytype);
        });

        console.log("wpAppType: ", wpAppType);
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }, [isActiveUser]);

  return (
    <div>
      <div className="flex-col" style={{ alignItems: "center" }}>
        <div className="flex primary-title">BLOCK BUILDER 😈</div>
        <div className="flex">
          <Parcer libraries={libraries} html={title} />
        </div>
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

export default connect(BlocksPage);
