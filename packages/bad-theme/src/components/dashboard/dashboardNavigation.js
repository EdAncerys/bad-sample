import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, logoutAction } from "../../context";

const DashboardNavigation = ({
  state,
  actions,
  libraries,
  dashboardPath,
  setDashboardPath,
}) => {
  const dispatch = useAppDispatch();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleNavigate = ({ e }) => {
    const menuItem = e.target.innerText;
    setDashboardPath(menuItem);
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
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("Directory"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Directory
        </div>
        <div
          className="dashboard-menu"
          style={{
            boxShadow: handleUnderline("My Account"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          My Account
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
            boxShadow: handleUnderline("Settings"),
          }}
          onClick={(e) => handleNavigate({ e })}
        >
          Settings
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
