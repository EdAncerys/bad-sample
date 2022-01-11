import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, loginAction } from "../../context";

const DashboardNavigation = ({
  state,
  actions,
  libraries,
  dashboardPath,
  setDashboardPath,
}) => {
  const dispatch = useAppDispatch();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleNavigate = ({ e }) => {
    const menuItem = e.target.innerText;
    console.log(menuItem);
    setDashboardPath(menuItem);
  };

  const handleUnderline = (path) => {
    if (path === dashboardPath) {
      return `0 3px tomato`;
    } else {
      return "none";
    }
  };

  return (
    <div
      className="shadow"
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: `${marginVertical}px 0`,
        marginBottom: `${marginVertical}px`,
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
        // onClick={() => loginAction({ state, dispatch })}
      >
        Log Out
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardNavigation);
