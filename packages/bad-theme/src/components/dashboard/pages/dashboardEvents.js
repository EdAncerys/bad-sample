import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Loading from "../../loading";
import Card from "../../card/card";
import BlockWrapper from "../../blockWrapper";
import EventListView from "../../eventListView";

// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  muiQuery,
  setGoToAction,
  getEventsData,
  handleSortFilter,
  fetchDataHandler,
} from "../../../context";

const DashboardEvents = ({ state, actions, libraries, activeUser }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, isActiveUser } = useAppState();
  const { lg } = muiQuery();
  const [listOfEvents, setListOfEvents] = useState([]);
  const [eventList, setEventList] = useState([]); // event data
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const DEFAULT_IMAGE = `https://cdn.bad.org.uk/uploads/2022/03/29195958/EVENTS.jpg`;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    try {
      let events = await getEventsData({ state, page: 1, postsPerPage: 4 });
      if (!events) return;
      // ⬇️⬇ sort events by date
      events = handleSortFilter({ list: events });
      // show only 4 events
      events = events.slice(0, 4);
      setEventList(events);

      if (!isActiveUser) return null;
      const { contactid } = isActiveUser;

      const path = state.auth.APP_HOST + "/videvent/" + contactid + "/entities";
      const fetchUserEvents = await fetchDataHandler({ path, state });

      if (fetchUserEvents.ok) {
        let filteredEvents = [];
        const json = await fetchUserEvents.json();
        json.data.map((event) => {
          filteredEvents.push(event.bad_eventid);
        });

        // convert object to array
        data = Object.values(data);
        const relatedEvents = data.filter((item) => {
          return filteredEvents.includes(item.acf.events_force_id);
        });

        setListOfEvents(relatedEvents);
      }
    } catch (err) {
      // console.log(err);
    }
    return () => {
      useEffectRef.current = ""; // clean up function
    };
  }, [isActiveUser, state.source.events]);

  if (dashboardPath !== "Events") return null;

  // SERVERS --------------------------------------------
  const ServeRegisteredEvents = () => {
    if (!isActiveUser) return <Loading />;

    return (
      <div>
        <TitleBlock
          block={{ text_align: "left", title: "Events I Am Registered For" }}
        />
        <BlockWrapper>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr`,
              padding: `0 ${marginHorizontal}px`,
            }}
          >
            {listOfEvents.length > 0 &&
              listOfEvents.map((block, key) => {
                return (
                  <div
                    key={key}
                    data-aos="fade"
                    data-aos-easing="ease-in-sine"
                    data-aos-delay={`${key * 50}`}
                    data-aos-duration="1000"
                    data-aos-offset="-120"
                  >
                    <EventListView block={block} />
                  </div>
                );
              })}

            {listOfEvents.length === 0 && (
              <div
                style={{
                  display: "flex-col",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: `1em 1em 0 1em`,
                }}
              >
                <div>
                  Events you are registered for will only appear here if you
                  have registered using the same email address that is
                  associated with your BAD / SIG membership account. Events
                  hosted by external parties may not appear here.
                </div>
                <div>
                  You are not currently registered for any events. View our
                  <span
                    className="caps-btn"
                    style={{ padding: "0 0.5em" }}
                    onClick={() =>
                      setGoToAction({
                        state,
                        path: "/events-content/",
                        actions,
                      })
                    }
                  >
                    Events Calendar
                  </span>
                  here.
                </div>
              </div>
            )}
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeDashEvents = () => {
    if (eventList.length === 0) return null;

    return (
      <div
        style={{
          paddingTop: `${marginVertical}px`,
        }}
      >
        <TitleBlock
          block={{
            text_align: "left",
            title: "Upcoming Events",
            disable_vertical_padding: true,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: !lg ? `repeat(4, 1fr)` : `1fr`, // layout settings
            gap: 20,
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          {eventList.map((block, key) => {
            const title = block.title.rendered;
            const { date_time, image } = block.acf;

            return (
              <Card
                key={key}
                title={title}
                // url={image}
                // imgHeight={200}
                link_label="Read More"
                link={block.link}
                colour={colors.turquoise}
                date={date_time}
                delay={key}
                seatNumber="seatNumber"
                cardHeight="100%"
                shadow
              />
            );
          })}
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeRegisteredEvents />
      <ServeDashEvents />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardEvents);
