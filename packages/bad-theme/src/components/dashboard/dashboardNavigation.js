import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  logoutAction,
  setDashboardPathAction,
} from "../../context";

const DashboardNavigation = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, isActiveUser } = useAppState();
  const [accessLevel, setAccessLevel] = useState(false);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    // 📌 check if user have fill access level to access members directory
    const isFullAccess =
      isActiveUser.bad_selfserviceaccess === state.theme.serviceAccess;

    if (
      isFullAccess &&
      isActiveUser.core_membershipstatus !== state.theme.frozenMembership
    ) {
      setAccessLevel(true);
    } else {
      setAccessLevel(false);
    }
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleNavigate = ({ e }) => {
    let menuItem = e.target.innerText;
    if (menuItem === "Log Out") menuItem = "Dashboard"; // If the user clicks on "Log Out" then we want to set the dashboard path to "Dashboard" instead of "Log Out".
    setDashboardPathAction({ dispatch, dashboardPath: menuItem });
  };

  const handleUnderline = (path) => {
    if (path === dashboardPath) {
      return `inset 0 -2px ${colors.darkSilver}`;
    } else {
      return "none";
    }
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
          justifyContent: "space-around",
          padding: `${marginVertical}px 0`,
        }}
      >
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Dashboard"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Dashboard
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Events"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Events
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Membership"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Membership
        </div>
        {accessLevel && (
          <div
            className="dashboard-menu"
            style={{
              boxShadow: handleUnderline("Members' Directory"),
            }}
            onClick={(e) => handleNavigate({ e })}
          >
            Members' Directory
          </div>
        )}
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("My Profile"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          My Profile
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Workforce Details"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Workforce Details
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Billing"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Billing
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Preferences"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Preferences
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Log Out"),
          }}
          onClick={(e) => {
            handleNavigate({ e });
            logoutAction({ state, dispatch, actions });
          }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardNavigation);
