import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";

import DashboardNavigation from "../components/dashboard/dashboardNavigation";
import Dashboard from "../components/dashboard/pages/dashboard";
import DashboardEvents from "../components/dashboard/pages/dashboardEvents";
import Directory from "../components/dashboard/pages/directory";
import Membership from "../components/dashboard/pages/membership";
import MyAccount from "../components/dashboard/pages/myAccount";
import Billing from "../components/dashboard/pages/billing";
import Settings from "../components/dashboard/pages/settings";

import BlockWrapper from "../components/blockWrapper";
// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  getDirectDebitAction,
  getApplicationStatus,
} from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser, dashboardPath } = useAppState();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const [isReady, setReady] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!isActiveUser) return null;

    await getDirectDebitAction({
      state,
      dispatch,
      id: isActiveUser.contactid,
    });
    await getApplicationStatus({
      state,
      dispatch,
      contactid: isActiveUser.contactid,
    });

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // prevent dashboard actions to load before all server side mutations loaded
  // allow css to load
  useLayoutEffect(() => {
    setReady(true);
  }, []);
  if (!isReady) return null;

  return (
    <div className="flex-col">
      <div className="flex-col">
        <BlockWrapper>
          {/* {!lg ? (
            <DashboardNavigation
          
            />
          ) : (
            <DashboardNavigationMobile
              dashboardPath={dashboardPath}
              setDashboardPath={setDashboardPath}
            />
          )} */}
          <DashboardNavigation />

          <Dashboard />
          <DashboardEvents />
          <Membership />
          <MyAccount />
          <Billing />
          <Settings />
        </BlockWrapper>

        <Directory />
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccountDashboard);
