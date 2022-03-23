import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import UpdateProfile from "../updateProfile";
import { colors } from "../../../config/colors";
import Loading from "../../loading";
import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
import ApplicationStatusOrPayment from "../ApplicationStatusOrPayment";
import Payments from "../payments";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, dynamicsApps } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;

  // const [isBADMember, setIsMember] = useState(false);

  if (dashboardPath !== "Dashboard") return null;

  // useEffect(() => {
  //   // if dynamic apps check if user have BAD membership
  //   if (dynamicsApps) {
  //     const isBADMember = dynamicsApps.subs.data.filter(
  //       (app) => app.bad_organisedfor === "BAD"
  //     );
  //     if (isBADMember.length) setIsMember(true);
  //   }
  // }, [dynamicsApps]);

  // SERVERS ---------------------------------------------
  const ServeApplicationStatus = () => {
    if (!dynamicsApps) return null;
    const { apps, subs } = dynamicsApps;

    const [applications, setApplications] = useState();

    useEffect(() => {
      setApplications(dynamicsApps.apps);
    }, [dynamicsApps]);

    if (apps.data.length === 0) return null;
    if (!applications) return <Loading />;
    return (
      <div>
        {applications.data.map((item, key) => {
          return (
            <ApplicationStatusOrPayment
              key={key}
              application={applications.data[key]}
            />
          );
        })}
      </div>
    );
  };

  const ServePayments = () => {
    if (!dynamicsApps) return null;

    const outstandingApps =
      dynamicsApps.apps.data.filter((item) => item.bad_sagepayid !== null)
        .length > 0;
    const outstandingSubs =
      dynamicsApps.subs.data.filter((item) => item.bad_sagepayid === null)
        .length > 0;
    const subsies = dynamicsApps.subs.data.filter(
      (item) => item.bad_sagepayid !== null
    );

    if (!outstandingSubs) return null;

    return <Payments subscriptions={dynamicsApps} dashboard />;
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <Profile />
        <ProfileProgress />
        <ServeApplicationStatus />
        <ServePayments />
        <UpdateProfile />
      </div>

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
