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
  Button,
} from "react-bootstrap";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);
  const NAV_DIVIDER = 8;

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, NAV_DIVIDER)); // main menu to display
    setWpMoreMenu(data.slice(NAV_DIVIDER, dataLength)); // more menu into dropdown
  }, [state.theme.menu]);

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ slug }) => {
    actions.router.set(`/${slug}`);
  };

  // SERVERS ----------------------------------------------------------
  const ServeMoreMenu = ({ title, menu }) => {
    if (!menu) return null;

    return (
      <NavDropdown
        title={title || "Menu Title"}
        style={{ position: "static" }} // static position adding ability for dropdown to move up the scope
      >
        {menu.map((item) => {
          const { ID, title, slug } = item;

          return (
            <div key={ID} className="flex-row">
              <NavDropdown.Item onClick={() => handleGoToPath({ slug })}>
                <Html2React html={title} />
              </NavDropdown.Item>
            </div>
          );
        })}
      </NavDropdown>
    );
  };

  const ServeMenu = () => {
    return (
      <div className="flex" style={styles.container}>
        {wpMainMenu.map((item) => {
          const { ID, title, slug } = item;

          const TEST_BLOCK = slug.includes("blocks-page")
            ? { color: colors.danger, fontWeight: "bold", fontSize: 20 }
            : {};

          if (item.child_items)
            return (
              <ServeMoreMenu
                key={ID}
                title={<Html2React html={title} />}
                menu={item.child_items}
              />
            );

          return (
            <div key={ID}>
              <Nav.Link
                style={{ ...styles.link, ...TEST_BLOCK }}
                onClick={() => handleGoToPath({ slug })}
              >
                <Html2React html={title} />
              </Nav.Link>
            </div>
          );
        })}
        <ServeMoreMenu title="More" menu={wpMoreMenu} />
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="flex">
                <ServeMenu />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 67,
    flexWrap: "wrap",
  },
  link: {
    color: colors.textMain,
    fontSize: 15,
    textTransform: "capitalize",
  },
};

export default connect(Navigation);
