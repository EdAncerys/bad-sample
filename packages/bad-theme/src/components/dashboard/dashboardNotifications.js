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
  handleGetCookie,
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
  const handelValidateMembership = () => {
    // --------------------------------------------------------------------------------
    // 📌  Validate user membership status
    // --------------------------------------------------------------------------------
    let membership = {
      isValid: true,
      message: state.theme.lapsedMembershipBody,
    };
    let paymentLapseTime = 5; // notification delay un minutes
    // console.log("🐞 dynamicsApps", dynamicsApps.subs.data); // debug

    // --------------------------------------------------------------------------------
    // 📌 if user core_membershipstatus is not set to Free, then return valid subscription
    // --------------------------------------------------------------------------------
    if (
      !isActiveUser ||
      isActiveUser.core_membershipstatus !== state.theme.frozenMembership
    )
      return membership;

    // check if cookie is set with user payment Date & value is less then paymentLapseTime in minutes
    const cookie = handleGetCookie({ name: "payment" });
    // check if value is less then 10 minutes
    if (cookie) {
      const now = new Date().getTime();
      const cookieDate = new Date(Number(cookie)).getTime(); // convert cookie to date

      const difference = now - cookieDate; // This will give difference in milliseconds
      // get time difference in minutes
      const resultInMinutes = Math.round(difference / 60000);

      if (resultInMinutes < paymentLapseTime) return membership;
    }

    // FREEZE membership status & set it to LAPSED by default
    membership.isValid = false;

    // check if subscriptions have FREEZE status
    let freezeMembershipList = [];
    if (dynamicsApps && dynamicsApps.subs) {
      // is lapsed if any bad_organisedfor === 'BAD' & core_membershipstatus === 'Completed' && subscription of previous year is completed
      freezeMembershipList = dynamicsApps.subs.data.filter((app) => {
        return (
          app.bad_organisedfor === "BAD" &&
          app.core_membershipstatus === state.theme.frozenMembership
        );
      });

      // 📌 uncoment below to eneable lapsed membership flip if user have applications form current year
      // if user have paid applications form current year then set lapsed membership to false
      // let isAppCurrentYear = freezeMembershipList.filter((app) => {
      //   return app.core_name.includes(currentYear);
      // });
      // if (isAppCurrentYear.length) freezeMembershipList = [];
    }

    // if user have any memberships set to FREEZ then set membership to freezed
    if (freezeMembershipList.length > 0)
      membership.message = state.theme.frozenMembershipBody;

    return membership;
  };

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  FEEZE & LAPSED membership notification hook
    // 📌  bad_selfserviceaccess & core_membershipstatus in subs as validation fileds for membership status
    // --------------------------------------------------------------------------------

    // member status notification - if user bad_selfserviceaccess === "FEEZE" then show notification
    if (handelValidateMembership().isValid) return;
    let message = handelValidateMembership().message; // user error message

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
    const membership = handelValidateMembership();

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
              handelValidateMembership().message !==
              state.theme.lapsedMembershipBody
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
