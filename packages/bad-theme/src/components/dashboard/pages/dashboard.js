import { useState, useEffect } from "react";
import { connect } from "frontity";

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
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
  const marginVertical = state.theme.marginVertical;

  if (dashboardPath !== "Dashboard") return null;

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
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <div>
        <Profile />
        <ProfileProgress />
        <ServeApplicationStatus />
        <ServePayments />
      </div>

      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <TitleBlock
          block={{ text_align: "left", title: "Upcoming Events" }}
          disableMargin
        />
        <Events
          block={{
            add_search_function: false,
            background_colour: "transparent",
            colour: colors.turquoise,
            disable_vertical_padding: false,
            event_type: false,
            grade_filter: "All Levels",
            grades: false,
            layout: "layout_three",
            locations: false,
            post_limit: "4",
            view_all_link: false,
          }}
          disableMargin
        />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
