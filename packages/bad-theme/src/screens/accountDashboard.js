import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";

import DashboardNavigation from "../components/dashboard/dashboardNavigation";
import DashboardNavigationMobile from "../components/dashboard/dashboardNavigationMobile";
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
  getDirectDebitAction,
  useAppState,
  useAppDispatch,
  dynamicsApps,
} from "../context";

import { handleGetCookie } from "../helpers/cookie";

import { muiQuery } from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const cookie = handleGetCookie({ name: `BAD-WebApp` });
  const { contactid, jwt } = cookie;

  const [applicationStatus, setApplicationStatus] = useState();
  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const [dashboardPath, setDashboardPath] = useState("Dashboard");
  const [visible, setVisible] = useState(true);

  const [isReady, SetReady] = useState(null);

  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!isActiveUser) return null;

    await getDirectDebitAction({
      state,
      dispatch,
      id: isActiveUser.contactid,
    });

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // prevent dashboard actions to load before all server side mutations loaded
  // allow css to load
  useLayoutEffect(() => {
    SetReady(true);
  }, []);

  useEffect(() => {
    const fetchApplicationBillingStatus = async () => {
      const getUserApplicationData = await fetch(
        state.auth.APP_HOST +
          "/applications/billing/84590b32-9490-ec11-b400-000d3a22037e",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const json = await getUserApplicationData.json();
      if (json) setApplicationStatus(json);
    };

    fetchApplicationBillingStatus();
  }, []);
  if (!isReady) return null;
  if (!cookie) return null;
  return (
    <div className="flex-col">
      <div className="flex-col">
        <BlockWrapper>
          {!lg ? (
            <DashboardNavigation
              dashboardPath={dashboardPath}
              setDashboardPath={setDashboardPath}
            />
          ) : (
            <DashboardNavigationMobile
              dashboardPath={dashboardPath}
              setDashboardPath={setDashboardPath}
            />
          )}
          <Dashboard
            dashboardPath={dashboardPath}
            userStatus={applicationStatus}
          />
          <DashboardEvents dashboardPath={dashboardPath} />
          <Membership dashboardPath={dashboardPath} />
          <MyAccount dashboardPath={dashboardPath} />
          <Billing
            dashboardPath={dashboardPath}
            userStatus={applicationStatus}
            visible={visible}
            setVisible={setVisible}
          />
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
