import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Loading from "../../loading";
import Card from "../../card/card";
import BlockWrapper from "../../blockWrapper";
import { getEventsData } from "../../../helpers";

// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  authenticateAppAction,
  muiQuery,
} from "../../../context";

const DashboardEvents = ({ state, actions, libraries, activeUser }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, isActiveUser, refreshJWT } = useAppState();
  const { lg } = muiQuery();
  const [listOfEvents, setListOfEvents] = useState();
  const [eventList, setEventList] = useState(null); // event data
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const DEFAULT_IMAGE = `https://cdn.bad.org.uk/uploads/2022/03/29195958/EVENTS.jpg`;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (dashboardPath !== "Events") return null;

    try {
      // pre fetch events data
      let data = state.source.events;
      if (!data) await getEventsData({ state, actions });
      console.log("🐞 ", data);
      // throw exception if no events
      if (!data) throw new Error("Faild to fetch events data");
      data = state.source.events;
      const events = Object.values(data).slice(0, 2);
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
      console.log(err);
    }
    return () => {
      useEffectRef.current = ""; // clean up function
    };
  }, [isActiveUser, dashboardPath]);

  if (dashboardPath !== "Events") return null;
  if (!listOfEvents || !isActiveUser) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div>
      <TitleBlock
        block={{ text_align: "left", title: "Events I Am Registered For" }}
      />
      <BlockWrapper>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: !lg ? "1fr 1fr" : `1fr`,
            gap: 20,
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          {listOfEvents.length > 0
            ? listOfEvents.map((item, key) => {
                return (
                  <Card
                    key={key}
                    title={item.title.rendered}
                    url={item.acf.image || DEFAULT_IMAGE}
                    imgHeight={200}
                    link_label="Go to the event's page"
                    link={item.acf.registration_page_link}
                    date={item.acf.date_time}
                    seatNumber="seatNumber"
                    cardHeight="100%"
                    shadow
                  />
                );
              })
            : "You are not registered for any events"}
        </div>
      </BlockWrapper>
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
          gridTemplateColumns: !lg ? `repeat(2, 1fr)` : `1fr`,
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
              url={image}
              imgHeight={200}
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

const styles = {
  container: {},
};

export default connect(DashboardEvents);
