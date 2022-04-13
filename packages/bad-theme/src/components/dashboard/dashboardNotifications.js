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
  const { isDashboardNotifications, dashboardPath, dynamicsApps } =
    useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------

  // SERVERS -----------------------------------------------------------------
  const ServeGoToActions = ({ path, title, isDismisable }) => {
    if (!path) return null;

    return (
      <div>
        <div className="flex">
          {isDismisable && (
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
          )}

          <div
            className="blue-btn"
            style={{ marginLeft: "2em", width: "fit-content" }}
            onClick={() =>
              setDashboardPathAction({ dispatch, dashboardPath: path })
            }
          >
            {title || "More"}
          </div>
        </div>
      </div>
    );
  };

  const ServeProfileReminders = () => {
    if (dashboardPath === "My Profile" || !isDashboardNotifications)
      return null;

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
            Please complete missing BAD profile information.
          </div>
          <ServeGoToActions
            path="My Profile"
            title="Go to my profile"
            isDismisable
          />
        </div>
      </div>
    );
  };

  const ServeAppReminders = () => {
    console.log("🐞 ", dynamicsApps);
    if (dashboardPath === "Billing" || !dynamicsApps) return null;
    // check if user have approved SIG membership for any of the categories
    const isPendingPayment = dynamicsApps.subs.data.filter(
      (app) => app.bad_organisedfor === "SIG" && !app.bad_sagepayid
    );
    if (isPendingPayment.length === 0) return null;

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
            Your SIG application has been approved.
          </div>
          <ServeGoToActions path="Billing" title="Pay Now" />
        </div>
      </div>
    );
  };

  return (
    <div>
      <ServeProfileReminders />
      <ServeAppReminders />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardNotifications);
