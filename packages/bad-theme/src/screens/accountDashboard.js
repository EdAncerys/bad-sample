import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import DashboardNavigation from "../components/dashboard/dashboardNavigation";
import Dashboard from "../components/dashboard/pages/dashboard";
import DashboardEvents from "../components/dashboard/pages/dashboardEvents";
import Directory from "../components/dashboard/pages/directory";
import Membership from "../components/dashboard/pages/membership";
import MyAccount from "../components/dashboard/pages/myAccount";
import Billing from "../components/dashboard/pages/billing";
import Settings from "../components/dashboard/pages/settings";
import DashboardNavigationMobile from "../components/dashboard/dashboardNavigationMobile";
import ButtonsRow from "../components/buttonsRow";
// BLOCK BUILDER ------------------------------------------------------------
import BlockBuilder from "../components/builder/blockBuilder";
// BLOCK WIDTH WRAPPER ------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  getDirectDebitAction,
  getApplicationStatus,
  muiQuery,
} from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps } = useAppState();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [isReady, setReady] = useState(null);
  const [isBADMember, setIsMember] = useState(false);
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

  useEffect(() => {
    // if dynamic apps check if user have BAD membership
    if (dynamicsApps) {
      const isBADMember = dynamicsApps.subs.data.filter(
        (app) => app.bad_organisedfor === "BAD"
      );
      if (isBADMember.length) setIsMember(true);
    }
  }, [dynamicsApps]);

  if (!isReady) return null;

  const ServeDashboardActions = () => {
    let applicationTitle = "Apply for BAD Membership";
    if (isBADMember)
      applicationTitle = "Apply to Change BAD Membership category";

    return (
      <div style={{ backgroundColor: colors.bgPink }}>
        <BlockWrapper>
          <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
            <ButtonsRow
              block={{
                buttons: [
                  {
                    title: applicationTitle,
                    colour: colors.navy,
                    link: { url: "/membership/categories-of-membership/" },
                  },
                  {
                    title: "Apply for SIG Membership",
                    colour: colors.green,
                    link: { url: "/derm-groups-charity/" },
                  },
                  {
                    title: "Register for an event",
                    colour: colors.turquoise,
                    link: { url: "/events-content/" },
                  },
                ],
                button_width: "33%",
              }}
              disableMargin
            />
          </div>
        </BlockWrapper>
      </div>
    );
  };

  return (
    <div className="flex-col">
      <div className="flex-col">
        <BlockWrapper>
          {!lg ? <DashboardNavigation /> : <DashboardNavigationMobile />}
          <Dashboard />
          <DashboardEvents />
          <Membership />
          <MyAccount />
          <Billing />
          <Settings />
        </BlockWrapper>

        <Directory />

        <ServeDashboardActions />
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccountDashboard);
