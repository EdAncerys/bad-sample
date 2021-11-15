import { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { Dropdown, DropdownButton, NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const NavigationActions = ({ state, actions }) => {
  // SERVERS ---------------------------------------------
  const ServeDropDownMenu = () => {
    return (
      <div className="dropdown">
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="warning btn-m" style={styles.dropDownBtn}>
              Quick Links
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ backgroundColor: colors.blue }}>
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
      <div className="flex-row" style={styles.container}>
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

        <ServeDropDownMenu />
      </div>
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 67,
  },
  dropDownBtn: {
    color: colors.textMain,
    fontSize: 15,
    backgroundColor: "transparent",
    textTransform: "capitalize",
    border: "none",
  },
  link: {
    color: colors.textMain,
    fontSize: 15,
    fontTransform: "capitalize",
  },
};

export default connect(NavigationActions);
