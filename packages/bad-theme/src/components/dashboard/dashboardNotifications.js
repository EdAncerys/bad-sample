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
  handelValidateMembership,
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
    // --------------------------------------------------------------------------------
    // 📌  FEEZE & LAPSED membership notification hook
    // 📌  bad_selfserviceaccess & core_membershipstatus in subs as validation fileds for membership status
    // --------------------------------------------------------------------------------

    // member status notification - if user bad_selfserviceaccess === "FEEZE" then show notification
    if (handelValidateMembership({ isActiveUser, dynamicsApps, state }).isValid)
      return;
    let message = handelValidateMembership({
      isActiveUser,
      dynamicsApps,
      state,
    }).message; // user error message

    // --------------------------------------------------------------------------------
    // 📌  Freeze & Lapsed membership notification popup
    // --------------------------------------------------------------------------------
    setErrorAction({
      dispatch,
      isError: {
        message,
        image: "Error",
      },
    });
  }, [isActiveUser, dynamicsApps]);

  // SERVERS -----------------------------------------------------------------
  const ServeGoToActions = ({
    path,
    title,
    isDismisable,
    id,
    isActive = true,
  }) => {
    if (!path) return null;

    return (
      <div
        className="flex"
        style={{
          marginLeft: "2em",
          alignItems: "center",
          justifyContent: "end",
          flex: isActive ? 0.5 : 0,
        }}
      >
        {isDismisable && (
          <div
            className="blue-btn"
            style={{ width: "fit-content" }}
            onClick={() =>
              setDashboardNotificationsAction({
                dispatch,
                isDashboardNotifications: [...isDashboardNotifications, id],
              })
            }
          >
            Dismiss
          </div>
        )}

        {isActive && (
          <div
            className="blue-btn"
            style={{ marginLeft: "2em", width: "fit-content" }}
            onClick={() =>
              setDashboardPathAction({ dispatch, dashboardPath: path })
            }
          >
            {title || "More"}
          </div>
        )}
      </div>
    );
  };

  const ServeProfileReminders = () => {
    const id = 1; // notification id

    if (
      dashboardPath === "My Profile" ||
      (isDashboardNotifications && isDashboardNotifications.includes(id))
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
            id={id}
            path="My Profile"
            title="Go to my profile"
            isDismisable
          />
        </div>
      </div>
    );
  };

  const ServeMembershipPaymentReminders = () => {
    const id = 2; // notification id

    const isBilling = dashboardPath === "Billing";
    const membership = handelValidateMembership({
      isActiveUser,
      dynamicsApps,
      state,
    });

    if (
      membership.isValid ||
      isBilling ||
      (isDashboardNotifications && isDashboardNotifications.includes(id))
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
            {membership.message}
          </div>

          <ServeGoToActions
            id={id}
            path="Billing"
            title="Pay Now"
            isDismisable
            isActive={
              handelValidateMembership({ isActiveUser, dynamicsApps, state })
                .message !== state.theme.lapsedMembershipBody
            }
          />
        </div>
      </div>
    );
  };

  const ServeAppReminders = () => {
    const id = 3; // notification id

    if (
      dashboardPath === "Billing" ||
      !dynamicsApps ||
      isDashboardNotifications.includes(id)
    )
      return null;

    // --------------------------------------------------------------------------------
    // 📌  check if user have approved SIG membership for any of the categories & application pending for payment is current year
    // --------------------------------------------------------------------------------
    const isPendingPayment = dynamicsApps.subs.data.filter((app) => {
      // get current year
      const currentYear = new Date().getFullYear();

      return (
        app.bad_organisedfor === "SIG" &&
        !app.bad_sagepayid &&
        app.core_endon.includes(currentYear) && // check if application is pending for payment for current year
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
          <ServeGoToActions id={id} path="Billing" title="Pay Now" />
        </div>
      </div>
    );
  };

  return (
    <div>
      <DirectDebitNotification />
      <ServeProfileReminders />
      <ServeAppReminders />
      <ServeMembershipPaymentReminders />
    </div>
  );
};

export default connect(DashboardNotifications);
