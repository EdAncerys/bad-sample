import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";

import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";

const Navigation = ({ state, actions }) => {
  // HELPERS ---------------------------------------------
  const ServeDropDown = () => {
    return (
      <NavDropdown
        title="Dropdown btn-block"
        id="collasible-nav-dropdown"
        style={{ position: "static" }} // static position adding ability for dropdown to move up the scope
      >
        <NavDropdown.Item
          href="#action/3.1"
          style={{ backgroundColor: colors.secondary }}
        >
          Action
        </NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                <ServeDropDown />
              </Nav>
              <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  Dank memes
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Navigation);
