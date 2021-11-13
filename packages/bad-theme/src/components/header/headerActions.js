import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../../config/colors";
import { Dropdown } from "react-bootstrap";

import BADLogo from "../../img/svg/badLogoHeader.svg";
import SearchIcon from "@mui/icons-material/Search";

const HeaderActions = ({ state, actions }) => {
  // HELPERS ----------------------------------------------------
  const handleLogin = () => {
    setLoginAction({ dispatch, setLogin: !setLogin });
  };

  const handleLogOut = () => {
    actions.theme.setTaken(null);
    actions.theme.setLogin(false);
    actions.router.set("/login");
  };

  // SERVERS ----------------------------------------------------
  const ServeLogoContainer = () => {
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={{ width: 385, height: 90 }}>
          <Image src={BADLogo} className="d-block h-100" alt="BAD" />
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
          <button className="btn btn-warning m-2" onClick={handleLogin}>
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
              variant="warning btn-m"
              style={{ textTransform: "uppercase" }}
            >
              Quick Links
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ backgroundColor: "#73a47" }}>
              <Dropdown.Item href="#">Arabic</Dropdown.Item>
              <Dropdown.Item href="#">English</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  };

  return (
    <div className="flex" style={{ alignItems: "center" }}>
      <div>
        <ServeLogoContainer />
      </div>
      <div
        className="flex-row"
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          paddingLeft: `1em`,
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
};

export default connect(HeaderActions);
