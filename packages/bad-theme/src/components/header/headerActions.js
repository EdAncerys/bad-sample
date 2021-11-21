import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Dropdown } from "react-bootstrap";

import { colors } from "../../config/colors";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import SearchIcon from "@mui/icons-material/Search";

const HeaderActions = ({ state, actions }) => {
  // HELPERS ----------------------------------------------------
  const handleGoToLink = () => {
    actions.router.set(`/`);
  };

  // SERVERS ----------------------------------------------------
  const ServeLogoContainer = () => {
    return (
      <div className="flex">
        <div
          style={{ width: 385, height: 90, cursor: "pointer" }}
          onClick={handleGoToLink}
        >
          <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
        </div>
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div className="flex d-none d-lg-block">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your search..."
          />
          <span className="input-group-text" id="basic-addon2">
            <SearchIcon />
          </span>
        </div>
      </div>
    );
  };

  const ServeAuthAction = () => {
    if (!state.theme.isLoggedIn)
      return (
        <div>
          <button
            className="btn shadow-none m-2"
            onClick={actions.context.setLoginAction}
            style={styles.loginBtn}
          >
            Login
          </button>
        </div>
      );

    return null;
  };

  const ServeDropDownMenu = () => {
    return (
      <div className="dropdown">
        <div>
          <Dropdown>
            <Dropdown.Toggle
              variant="shadow-none btn-m"
              style={styles.dropDownBtn}
            >
              Quick Links
            </Dropdown.Toggle>

            <Dropdown.Menu style={styles.dropDown}>
              <Dropdown.Item onClick={actions.context.setCreateAccountAction}>
                Create Account
              </Dropdown.Item>
              <Dropdown.Item onClick={actions.context.setEnquireAction}>
                Enquire
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex"
      style={{
        alignItems: "center",
        borderBottom: `1px solid ${colors.primary}`,
      }}
    >
      <ServeLogoContainer />
      <div
        className="flex-row"
        style={{
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <ServeSearchContainer />
        <ServeAuthAction />
        <ServeDropDownMenu />
      </div>
    </div>
  );
};

const styles = {
  container: {},
  dropDownBtn: {
    fontSize: 16,
    backgroundColor: colors.lightSilver,
    textTransform: "capitalize",
    border: "none",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
  },
  loginBtn: {
    fontSize: 16,
    color: colors.white,
    backgroundColor: colors.primary,
    textTransform: "capitalize",
    border: "none",
  },
};

export default connect(HeaderActions);
