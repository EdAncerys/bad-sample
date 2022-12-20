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
import Workforce from "../components/dashboard/pages/workforce";
import Billing from "../components/dashboard/pages/billing";
import Preferences from "../components/dashboard/pages/settings";
import DashboardNavigationMobile from "../components/dashboard/dashboardNavigationMobile";
import ButtonsRow from "../components/buttonsRow";
import ActionPlaceholder from "../components/actionPlaceholder";
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
  handleUpdateMembershipApplication,
  handelValidateMembership,
} from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps, applicationData } = useAppState();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [isReady, setReady] = useState(null);
  const [subsData, setSubsData] = useState(null);
  const [isFetching, setFetching] = useState(false);
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
        isDashboardNotifications: [],
      });

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

    // 👇 set on focus handler
    window.addEventListener("focus", onfocusHandler);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [isActiveUser]);

  // prevent dashboard actions to load before all server side mutations loaded
  // allow css to load
  useLayoutEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    // if dynamic apps check if user have BAD membership
    if (dynamicsApps) {
      const currentYear = new Date().getFullYear();
      const subsData = dynamicsApps.subs.data; // get subs data form dynamic apps
      const isBADMember = subsData.filter(
        (app) =>
          app.bad_organisedfor === "BAD" && app.core_endon.includes(currentYear)
      );
      if (isBADMember.length) {
        setIsMember(true);
        setSubsData(isBADMember);
      }
    }
  }, [dynamicsApps]);

  // --------------------------------------------------------------------------------
  // ⚠️ on focus of page handler
  // refetch subscriptions and apps data to update payment status
  // --------------------------------------------------------------------------------
  const onfocusHandler = async () => {
    console.log("🐞 onfocusHandler");

    try {
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });
      // 👉 remove initiatedPayments on mount action
      state.data.initiatedPayments = [];
    } catch (error) {
      console.log("🐞 error", error);
    }
  };

  if (!isReady) return null;

  // HANDLERS --------------------------------------------------
  const handleApply = async () => {
    // set filter cat type in context to filter SIGs
    setCPTBlockTypeAction({ dispatch, cptBlockTypeFilter: true });
    // redirect to apply page
    setGoToAction({ state, path: "/derm-groups-charity/", actions });
  };

  const handleApplyForMembershipChange = async () => {
    await handleUpdateMembershipApplication({
      state,
      actions,
      dispatch,
      isActiveUser,
      dynamicsApps,
      app: subsData[0], // get first subs data for change of membership
      applicationData,
      setFetching,
    });
  };

  const ServeDashboardActions = () => {
    let applicationTitle = "Apply for BAD Membership";
    let applicationPath = "/membership/categories-of-membership/";
    if (isBADMember) {
      applicationTitle = "Apply to Change BAD Membership category";
      applicationPath = "/membership/step-1-the-process/";
    }
    if (
      handelValidateMembership({
        isActiveUser,
        dynamicsApps,
        state,
      }).message === state.theme.lapsedMembershipBody
    ) {
      // set default message if user have lapsed membership
      applicationTitle = "Apply for BAD Membership";
      applicationPath = "/membership/categories-of-membership/";
    }

    return (
      <div style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <BlockWrapper>
          <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
            <ButtonsRow
              block={{
                buttons: [
                  {
                    title: applicationTitle,
                    colour: colors.navy,
                    // add redirect link if !isBADMember
                    link: isBADMember ? null : { url: applicationPath },
                    // add onClick action if isBADMember
                    onClickAction: isBADMember
                      ? () => handleApplyForMembershipChange()
                      : null,
                    // disable button if user have Freeze status
                    disable:
                      handelValidateMembership({
                        isActiveUser,
                        dynamicsApps,
                        state,
                      }).message === state.theme.frozenMembershipBody,
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
            <Workforce />
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
