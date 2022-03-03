import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { Dropdown } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  logoutAction,
  setDashboardPathAction,
} from "../../context";

const DashboardNavigationMobile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { dashboardPath } = useAppState();

  // HELPERS ----------------------------------------------------------------
  const handleNavigate = ({ e }) => {
    let menuItem = e.target.innerText;
    if (menuItem === "Log Out") menuItem = "Dashboard"; // If the user clicks on "Log Out" then we want to set the dashboard path to "Dashboard" instead of "Log Out".
    setDashboardPathAction({ dispatch, dashboardPath: menuItem });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle style={styles.dropdownToggle} id="dropdown-basic">
        Navigate
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "100%" }}>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Dashboard
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Events
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Membership
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Directory
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          My account
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Billing
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => handleNavigate({ e })}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => {
            handleNavigate({ e });
            logoutAction({ state, dispatch, actions });
          }}
        >
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const styles = {
  container: {},
  dropdownToggle: {
    width: "100%",
    backgroundColor: colors.darkSilver,
    borderRadius: 0,
    justifyContent: "center",
  },
};

export default connect(DashboardNavigationMobile);
