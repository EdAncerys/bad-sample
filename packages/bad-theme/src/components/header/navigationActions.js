import { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { Dropdown, DropdownButton, NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const NavigationActions = ({ state, actions }) => {
  // HELPERS ---------------------------------------------

  return (
    <div style={styles.container}>
      <Link className="m-2" link="/" style={styles.link}>
        Guidance & Standards
      </Link>
      <Link className="m-2" link="/" style={styles.link}>
        Clinical Services
      </Link>
      <Link className="m-2" link="/" style={styles.link}>
        Education & Training
      </Link>
      <Link className="m-2" link="/" style={styles.link}>
        Events
      </Link>
      <Link className="m-2" link="/" style={styles.link}>
        Journal & Research
      </Link>
      <Link className="m-2" link="/" style={styles.link}>
        Membership
      </Link>
      <NavDropdown title="More" style={styles.link}>
        <NavDropdown.Item href="#action/3.1" style={styles.link}>
          Action
        </NavDropdown.Item>
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
  },
  link: {
    fontSize: "0.8em",
    color: colors.black,
    fontTransform: "capitalize",
  },
};

export default connect(NavigationActions);
