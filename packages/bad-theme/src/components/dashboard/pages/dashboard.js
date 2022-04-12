import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import { colors } from "../../../config/colors";
import Loading from "../../loading";
import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
import ApplicationStatusOrPayment from "../ApplicationStatusOrPayment";
import Payments from "../payments";
import Card from "../../../components/card/card";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch, muiQuery } from "../../../context";
import { getEventsData } from "../../../helpers";
const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { lg } = muiQuery();

  const { dashboardPath, dynamicsApps } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [eventList, setEventList] = useState(null); // event data
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // pre fetch events data
    let data = state.source.events;
    if (!data) await getEventsData({ state, actions });
    data = state.source.events;
    // convert to object & return first 2 records
    const events = Object.values(data).slice(0, 4);
    setEventList(events);

    return () => {
      useEffectRef.current = ""; // clean up function
    };
  }, []);

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

  if (dashboardPath !== "Dashboard") return null;
  if (!eventList) return <Loading />;

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: !lg ? `repeat(4, 1fr)` : "1fr",
            gap: 20,
          }}
        >
          {eventList.map((block, key) => {
            const title = block.title.rendered;

            return (
              <Card
                key={key}
                title={title}
                link_label="Read More"
                link={block.link}
                colour={colors.turquoise}
                eventHeader={block.acf}
                isFrom4Col
                titleLimit={4}
                shadow
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
