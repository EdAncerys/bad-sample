import { useState, useLayoutEffect } from "react";
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

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [dashboardPath, setDashboardPath] = useState("Dashboard");
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const [isReady, SetReady] = useState(null);

  // prevent dashboard actions to load before all server side mutations loaded
  useLayoutEffect(() => {
    SetReady(true);
  }, []);
  if (!isReady) return null;

  return (
    <div className="flex-col">
      <div className="flex-col">
        <BlockWrapper>
          <DashboardNavigation
            dashboardPath={dashboardPath}
            setDashboardPath={setDashboardPath}
          />

          <Dashboard dashboardPath={dashboardPath} />
          <DashboardEvents dashboardPath={dashboardPath} />
          <Membership dashboardPath={dashboardPath} />
          <MyAccount dashboardPath={dashboardPath} />
          <Billing dashboardPath={dashboardPath} />
          <Settings dashboardPath={dashboardPath} />
        </BlockWrapper>

        <Directory dashboardPath={dashboardPath} />
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccountDashboard);
