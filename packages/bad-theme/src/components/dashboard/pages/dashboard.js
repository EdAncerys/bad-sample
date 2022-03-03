import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import UpdateProfile from "../updateProfile";
import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
import ApplicationStatusOrPayment from "../ApplicationStatusOrPayment";
import Payments from "../payments";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, dynamicsApps } = useAppState();

  if (dashboardPath !== "Dashboard") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    if (!dynamicsApps) return null;
    const { apps, subs } = dynamicsApps;

    if (dynamicsApps.apps.data > 0) {
      const data = dynamicsApps.apps.data;
      const unapprovedApplications = data.filter(function (singleApplication) {
        return singleApplication.bad_approvalstatus == "Yes";
      });
    }

    const ServeApplicationStatus = () => {
      if (apps.data.length === 0) return null;
      return (
        <div>
          {apps.data.map((item, key) => {
            return (
              <ApplicationStatusOrPayment
                application={dynamicsApps.apps.data[key]}
              />
            );
          })}
        </div>
      );
    };

    const ServePayments = () => {
      console.log("SERVEPAYMENTS", dynamicsApps);
      const outstandingApps =
        dynamicsApps.apps.data.filter((item) => item.bad_sagepayid !== null)
          .length > 0;
      const outstandingSubs =
        dynamicsApps.subs.data.filter((item) => item.bad_sagepayid !== null)
          .length > 0;
      if (!outstandingApps && !outstandingSubs) return null;

      return <Payments subscriptions={dynamicsApps} dashboard />;
    };

    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <Profile />
        <ProfileProgress />
        <ServeApplicationStatus />
        <ServePayments />
        <UpdateProfile />
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeDashboard />

      <TitleBlock block={{ text_align: "left", title: "Upcoming Events" }} />
      <Events
        block={{
          add_search_function: false,
          background_colour: "transparent",
          colour: colors.turquoise,
          disable_vertical_padding: false,
          event_type: false,
          grade_filter: "All Levels",
          grades: false,
          layout: "layout_two",
          locations: false,
          post_limit: "2",
          view_all_link: false,
        }}
      />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
