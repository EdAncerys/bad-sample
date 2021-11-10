import { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { Dropdown, DropdownButton, NavDropdown } from "react-bootstrap";

const NavigationActions = ({ state, actions }) => {
  // HELPERS ---------------------------------------------

  return (
    <div style={styles.container}>
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
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    fontSize: "0.8em",
  },
};

export default connect(NavigationActions);
