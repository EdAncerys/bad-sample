import React from "react";
import { connect } from "frontity";

import DirectDebitNotification from "./directDebitNotification";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardNotificationsAction,
  setDashboardPathAction,
  muiQuery,
} from "../../context";

const DashboardNotifications = ({ state }) => {
  const { lg } = muiQuery();
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
            flexDirection: !lg ? null : "column",
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
    if (dashboardPath === "Billing" || !dynamicsApps) return null;
    // check if user have approved SIG membership for any of the categories
    const isPendingPayment = dynamicsApps.subs.data.filter((app) => {
      return (
        app.bad_organisedfor === "SIG" &&
        !app.bad_sagepayid &&
        app.bad_outstandingpayments !== "£0.00" // payments with 0 outstanding payments are not shown
      );
    });
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
      <DirectDebitNotification />
      <ServeProfileReminders />
      <ServeAppReminders />
    </div>
  );
};

export default connect(DashboardNotifications);
