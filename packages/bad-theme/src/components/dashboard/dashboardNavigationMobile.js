import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, logoutAction } from "../../context";
import { Dropdown } from "react-bootstrap";

const DashboardNavigationMobile = ({
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
