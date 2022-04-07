import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardNotificationsAction,
  setDashboardPathAction,
} from "../../context";

const DashboardNotifications = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isDashboardNotifications } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  if (!isDashboardNotifications) return null;

  // HELPERS ----------------------------------------------------------------

  // SERVERS -----------------------------------------------------------------
  const ServeActions = () => {
    return (
      <div>
        <div className="flex">
          <div
            className="blue-btn"
            style={{ width: "fit-content" }}
            onClick={() =>
              setDashboardNotificationsAction({
                dispatch,
                isDashboardNotifications: null,
              })
            }
          >
            Dismiss
          </div>

          <div
            className="blue-btn"
            style={{ marginLeft: "2em", width: "fit-content" }}
            onClick={() =>
              setDashboardPathAction({ dispatch, dashboardPath: "My Profile" })
            }
          >
            Go to My Profile
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="no-selector"
      style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}
    >
      <div
        className="shadow"
        style={{
          display: "flex",
          padding: `1em 4em`,
        }}
      >
        <div
          className="flex primary-title"
          style={{ display: "grid", alignItems: "center", fontSize: 20 }}
        >
          Please complete missiing BAD profile information.
        </div>
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardNotifications);
