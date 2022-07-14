import { useEffect } from "react";
import { connect } from "frontity";

import DirectDebitNotification from "./directDebitNotification";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardNotificationsAction,
  setDashboardPathAction,
  muiQuery,
  setErrorAction,
} from "../../context";

const DashboardNotifications = ({ state }) => {
  const { lg } = muiQuery();
  // --------------------------------------------------------------------------------
  const dispatch = useAppDispatch();
  const {
    isDashboardNotifications,
    dashboardPath,
    dynamicsApps,
    isActiveUser,
  } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS -----------------------------------------------------------------
  useEffect(() => {
    // break if core_membershipstatus !frozen
    if (
      isActiveUser &&
      isActiveUser.core_membershipstatus !== state.theme.frozenMembership
    )
      return;

    // user payment message based on
    let message = state.theme.frozenMembershipBody;

    if (
      isActiveUser &&
      isActiveUser.core_membershipstatus === state.theme.lapsedMembership
    )
      message = state.theme.lapsedMembershipBody;

    setErrorAction({
      dispatch,
      isError: {
        message,
        image: "Error",
      },
    });
  }, [isActiveUser]);

  // SERVERS -----------------------------------------------------------------
  const ServeGoToActions = ({ path, title, isDismisable, id }) => {
    if (!path) return null;

    return (
      <div
        className="flex"
        style={{ marginLeft: "2em", alignItems: "center", flex: 0.5 }}
      >
        {isDismisable && (
          <div
            className="blue-btn"
            style={{ width: "fit-content" }}
            onClick={() =>
              setDashboardNotificationsAction({
                dispatch,
                isDashboardNotifications: { title, id },
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
    );
  };

  const ServeProfileReminders = () => {
    if (
      dashboardPath === "My Profile" ||
      (isDashboardNotifications && isDashboardNotifications.id === "1")
    )
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
            id="1"
            path="My Profile"
            title="Go to my profile"
            isDismisable
          />
        </div>
      </div>
    );
  };

  const ServePaymentReminders = () => {
    if (
      dashboardPath === "Billing" ||
      (isDashboardNotifications && isDashboardNotifications.id === "2") ||
      (isActiveUser &&
        isActiveUser.core_membershipstatus !== state.theme.frozenMembership)
    )
      return null;

    // user payment message based on
    let message = state.theme.frozenMembershipBody;

    if (
      isActiveUser &&
      isActiveUser.core_membershipstatus === state.theme.lapsedMembership
    )
      message = state.theme.lapsedMembershipBody;

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
            {message}
          </div>
          <ServeGoToActions
            id="2"
            path="Billing"
            title="Pay Now"
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
          <ServeGoToActions id="1" path="Billing" title="Pay Now" />
        </div>
      </div>
    );
  };

  return (
    <div>
      <DirectDebitNotification />
      <ServeProfileReminders />
      <ServeAppReminders />
      <ServePaymentReminders />
    </div>
  );
};

export default connect(DashboardNotifications);
