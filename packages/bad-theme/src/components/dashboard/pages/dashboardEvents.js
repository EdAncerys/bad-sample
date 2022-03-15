import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
import Loading from "../../loading";
import Card from "../../card/card";
// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  authenticateAppAction,
} from "../../../context";
import BlockWrapper from "../../blockWrapper";

const DashboardEvents = ({ state, actions, libraries, activeUser }) => {
  const [listOfEvents, setListOfEvents] = useState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const DEFAULT_IMAGE = `${state.auth.WORDPRESS_URL}wp-content/uploads/2022/03/EVENTS.jpg`;
  const dispatch = useAppDispatch();
  const { dashboardPath, isActiveUser } = useAppState();
  if (!isActiveUser) return <Loading />;
  useEffect(() => {
    const filterEvents = async () => {
      await actions.source.fetch("/events/");
      const allEvents = Object.values(state.source.events);
      const { contactid } = isActiveUser;
      const jwt = await authenticateAppAction({ dispatch, state });
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
        console.log("FILTERYD", filteredEvents);
        console.log("ALLKA", allEvents);
        const filteredCompletely = allEvents.filter((item) => {
          return filteredEvents.includes(item.acf.events_force_id);
        });
        setListOfEvents(filteredCompletely);
      }
    };
    filterEvents();
  }, []);

  if (dashboardPath !== "Events") return null;

  // RETURN ---------------------------------------------
  if (!listOfEvents) return <Loading />;
  return (
    <div>
      <TitleBlock
        block={{ text_align: "left", title: "Events I Am Registered For" }}
      />
      <BlockWrapper>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          {listOfEvents.length > 0
            ? listOfEvents.map((item, key) => {
                console.log(item);
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

export default connect(DashboardEvents);
