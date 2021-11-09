import React, { useState, useEffect } from "react";
import { connect, Global, css } from "frontity";
import Link from "@frontity/components/link";
import HeadComponent from "./headComponent";
import bootStrapCSS from "../css/bootstrap.min.css";
import globalCSS from "../css/main.css";
import Image from "@frontity/components/image";
import { handleSetCookie } from "../helpers/cookie";
import {
  Dropdown,
  DropdownButton,
  Navbar,
  Nav,
  NavDropdown,
  Container,
} from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoginAction } from "../context";
import { colors } from "../config/colors";

const Header = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { setLogin } = useAppState();
  const data = state.source.get(state.router.link);

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
      <div class="input-group" style={{ display: "flex", flex: 1.5 }}>
        <input
          type="text"
          class="form-control"
          placeholder="Enter your search..."
        />
        <span class="input-group-text" id="basic-addon2">
          @
        </span>
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
      <DropdownButton
        align="end"
        title="Dropdown end"
        id="dropdown-menu-align-end"
        style={{ display: "flex", flex: 1 }}
      >
        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
      </DropdownButton>
    );
  };

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}
        `}
      />
      <HeadComponent />
      <div style={styles.header}>
        <div style={styles.topRowWrapper}>
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

        <div style={styles.bottomRowWrapper}>
          <Link className="m-2" link="/">
            Guidance & Standards
          </Link>
          <Link className="m-2" link="/events">
            Clinical Services
          </Link>
          <Link className="m-2" link="/create-account">
            Education & Training
          </Link>
          <Link className="m-2" link="/create-account">
            Events
          </Link>
          <Link className="m-2" link="/create-account">
            Journal & Research
          </Link>
          <Link className="m-2" link="/create-account">
            Membership
          </Link>
          <NavDropdown title="More">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
    </>
  );
};

const styles = {
  header: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: `${colors.white}`,
    borderBottom: `2px solid ${colors.silver}`,
  },
  topRowWrapper: {
    display: "flex",
    alignItems: "center",
  },
  bottomRowWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    fontSize: "0.8em",
  },
};

export default connect(Header);
