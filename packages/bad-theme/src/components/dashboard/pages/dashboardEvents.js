import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Loading from "../../loading";
import Card from "../../card/card";
import BlockWrapper from "../../blockWrapper";
import { getEventsData } from "../../../helpers";
import EventListView from "../../eventListView";

// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  authenticateAppAction,
  muiQuery,
  setGoToAction,
} from "../../../context";

const DashboardEvents = ({ state, actions, libraries, activeUser }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, isActiveUser, refreshJWT } = useAppState();
  const { lg } = muiQuery();
  const [listOfEvents, setListOfEvents] = useState();
  const [eventList, setEventList] = useState([]); // event data
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const DEFAULT_IMAGE = `https://cdn.bad.org.uk/uploads/2022/03/29195958/EVENTS.jpg`;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    try {
      // pre fetch events data
      let data = state.source.events;
      if (!data) await getEventsData({ state, actions });
      // throw exception if no events
      if (!data) throw new Error("Faild to fetch events data");
      data = state.source.events;
      if (data) data = Object.values(data);
      // 📌 sort events by date newest first
      data.sort((a, b) => {
        let dateA = a.acf.date_time;
        let dateB = b.acf.date_time;
        if (dateA) dateA = dateA[0].date;
        if (dateB) dateB = dateB[0].date;
        // convert to date object
        dateA = new Date(dateA);
        dateB = new Date(dateB);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });

      // 📌 sort eventList by closest to today first (if date is set)
      data.sort((a, b) => {
        let dateA = a.acf.date_time;
        let dateB = b.acf.date_time;
        if (dateA) dateA = dateA[0].date;
        if (dateB) dateB = dateB[0].date;

        // convert to date object
        dateA = new Date(dateA);
        dateB = new Date(dateB);

        // get today's date
        let today = new Date();

        // get date difference
        let diffA = Math.abs(dateA - today);
        let diffB = Math.abs(dateB - today);

        if (diffA > diffB) return 1;
        if (diffA < diffB) return -1;

        return 0;
      });

      const events = data.slice(0, 4);
      setEventList(events);

      if (!isActiveUser) return null;
      const { contactid } = isActiveUser;
      const jwt = await authenticateAppAction({ dispatch, refreshJWT, state });
      const fetchUserEvents = await fetch(
        state.auth.APP_HOST + "/videvent/" + contactid + "/entities",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

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
    if (!listOfEvents || !isActiveUser) return <Loading />;

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
                  // <Card
                  //   key={key}
                  //   title={block.title.rendered}
                  //   url={item.acf.image || DEFAULT_IMAGE}
                  //   imgHeight={200}
                  //   link_label="Go to the event's page"
                  //   link={block.acf.registration_page_link}
                  //   date={block.acf.date_time}
                  //   seatNumber="seatNumber"
                  //   cardHeight="100%"
                  //   shadow
                  // />

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
                  padding: `0 1em`,
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
