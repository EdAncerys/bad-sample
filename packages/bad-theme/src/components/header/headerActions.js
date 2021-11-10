import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../../config/colors";
import { Dropdown } from "react-bootstrap";

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
          justifyContent: "center",
          alignItems: "center",
          margin: "0.5em 2em",
          width: 250,
          height: 100,
          backgroundColor: colors.silver,
        }}
      >
        <Image
          className="d-block w-100"
          src="https://www.skinhealthinfo.org.uk/wp-content/themes/construct/assets/images/logo.svg"
          alt="Title"
          height={100}
        />
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div className="d-none d-lg-block">
        <div className="input-group lg" style={{ display: "flex", flex: 1.5 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your search..."
          />
          <span className="input-group-text" id="basic-addon2">
            @
          </span>
        </div>
      </div>
    );
  };

  const ServeAuthAction = () => {
    if (!state.theme.isLoggedIn)
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-warning m-2" onClick={handleLogin}>
            Login
          </button>
        </div>
      );

    return null;
  };

  const ServeDropDownMenu = () => {
    return (
      <div className="dropdown" style={{ display: "flex", flex: 1 }}>
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
    <div style={styles.container}>
      <div style={{ display: "flex", flex: 1 }}>
        <ServeLogoContainer />
      </div>
      <div
        style={{
          display: "flex",
          flex: 1.5,
          justifyContent: "space-between",
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
  container: {
    display: "flex",
    alignItems: "center",
  },
};

export default connect(HeaderActions);
