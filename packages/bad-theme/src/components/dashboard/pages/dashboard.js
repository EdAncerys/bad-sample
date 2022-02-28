import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import UpdateProfile from "../updateProfile";
import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
import ApplicationStatusOrPayment from "../ApplicationStatusOrPayment";

const Dashboard = ({
  state,
  actions,
  libraries,
  dashboardPath,
  userStatus,
}) => {
  if (dashboardPath !== "Dashboard") return null;
  if (!userStatus) return null;

  const { apps, subs } = userStatus;
  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    console.log(userStatus);
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <Profile />
        {apps.data.length > 0 || subs.data.length > 0 ? (
          <ApplicationStatusOrPayment userStatus={userStatus} />
        ) : (
          <ProfileProgress />
        )}
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
