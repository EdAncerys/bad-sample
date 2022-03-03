import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import TitleBlock from "../../titleBlock";
import Events from "../../events/events";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const DashboardEvents = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath } = useAppState();

  if (dashboardPath !== "Events") return null;

  // RETURN ---------------------------------------------
  return (
    <div>
      <TitleBlock
        block={{ text_align: "left", title: "Events I Am Registered For" }}
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
          post_limit: "4",
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
