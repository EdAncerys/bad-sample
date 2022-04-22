import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import DashboardNavigation from "../components/dashboard/dashboardNavigation";
import DashboardNotifications from "../components/dashboard/dashboardNotifications";
import Dashboard from "../components/dashboard/pages/dashboard";
import DashboardEvents from "../components/dashboard/pages/dashboardEvents";
import Directory from "../components/dashboard/pages/directory";
import Membership from "../components/dashboard/pages/membership";
import MyProfile from "../components/dashboard/pages/myAccount";
import Billing from "../components/dashboard/pages/billing";
import Preferences from "../components/dashboard/pages/settings";
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
  setGoToAction,
  setDashboardNotificationsAction,
  setCPTBlockTypeAction,
} from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps, applicationData, refreshJWT } =
    useAppState();

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
    let isProfileComplete = true;
    // --------------------------------------------------------------------------------
    // 📌 SET Dashboard notification if user profile not complete
    // --------------------------------------------------------------------------------
    if (!isActiveUser.emailaddress1) isProfileComplete = false;
    if (!isActiveUser.address2_line1) isProfileComplete = false;
    if (!isActiveUser.address2_city) isProfileComplete = false;
    if (!isActiveUser.address2_postalcode) isProfileComplete = false;
    if (!isActiveUser.address2_country) isProfileComplete = false;
    if (!isActiveUser.jobtitle) isProfileComplete = false;
    if (!isActiveUser.mobilephone) isProfileComplete = false;
    // personal information pane
    if (!isActiveUser.firstname) isProfileComplete = false;
    if (!isActiveUser.lastname) isProfileComplete = false;
    if (!isActiveUser.gendercode) isProfileComplete = false;
    if (!isActiveUser.birthdate) isProfileComplete = false;
    if (!isActiveUser.py3_ethnicity) isProfileComplete = false;

    if (!isProfileComplete)
      setDashboardNotificationsAction({
        dispatch,
        isDashboardNotifications: !isProfileComplete,
      });

    await getDirectDebitAction({
      state,
      dispatch,
      id: isActiveUser.contactid,
      refreshJWT,
    });
    await getApplicationStatus({
      state,
      dispatch,
      contactid: isActiveUser.contactid,
      refreshJWT,
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

  // HANDLERS --------------------------------------------------
  const handleApply = async () => {
    // set filter cat type in context to filter SIGs
    setCPTBlockTypeAction({ dispatch, cptBlockTypeFilter: true });
    // redirect to apply page
    setGoToAction({ state, path: "/derm-groups-charity/", actions });
  };

  const ServeDashboardActions = () => {
    let applicationTitle = "Apply for BAD Membership";
    let applicationPath = "/membership/categories-of-membership/";
    if (isBADMember) {
      applicationTitle = "Apply to Change BAD Membership category";
      applicationPath = "/membership/step-1-the-process/";
    }

    return (
      <div>
        <BlockWrapper>
          <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
            <ButtonsRow
              block={{
                buttons: [
                  {
                    title: applicationTitle,
                    colour: colors.navy,
                    link: { url: applicationPath },
                  },
                  {
                    title: "Apply for SIG Membership",
                    colour: colors.green,
                    onClickAction: () => handleApply(), // * = all categories
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
        <div className="flex-col">
          <BlockWrapper>
            {!lg ? <DashboardNavigation /> : <DashboardNavigationMobile />}
            <DashboardNotifications />

            <Dashboard />
            <DashboardEvents />
            <Membership />
            <MyProfile />
            <Billing />
            <Preferences />
          </BlockWrapper>

          <Directory />
        </div>
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
