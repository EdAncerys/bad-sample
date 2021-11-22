import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import NavBarDropDownContent from "./navDropDownContent";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);

  const NAV_DIVIDER = 8;
  const BANNER_HEIGHT = state.theme.bannerHeight;

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

  const ServeMainMenuDropDown = ({ title, menu, slugPrefix }) => {
    if (!menu) return null;

    return (
      <NavDropdown
        title={title || "Menu Title"}
        style={{ position: "static" }} // static position adding ability for dropdown to move up the scope
      >
        <div
          className="flex"
          style={{
            padding: `2em 4em`,
            height: BANNER_HEIGHT,
            backgroundColor: colors.lightSilver, // nav bar dropdown background color
            border: `1px solid ${colors.darkSilver}`,
          }}
        >
          <div
            style={{
              overflow: "auto",
              width: `30%`,
            }}
          >
            {menu.map((item) => {
              const { ID, title, slug } = item;
              const SLUG_PATH = slugPrefix + "/" + slug; // combining parent & child path

              return (
                <div key={ID} className="flex-row">
                  <NavDropdown.Item
                    className="pointer"
                    style={{
                      alignItems: "center",
                      padding: `1em 0 1em`,
                      borderBottom: `1px dotted ${colors.silver}`,
                    }}
                    onClick={() => handleGoToPath({ slug: SLUG_PATH })}
                  >
                    <div className="flex-row">
                      <div
                        className="flex"
                        style={{ textTransform: "capitalize" }}
                      >
                        <Html2React html={title} />
                      </div>
                      <KeyboardArrowRightIcon
                        style={{
                          fill: colors.darkSilver,
                          borderRadius: "50%",
                          padding: 0,
                        }}
                      />
                    </div>
                  </NavDropdown.Item>
                </div>
              );
            })}
          </div>
          <div className="flex" style={{ justifyContent: "center" }}>
            <NavBarDropDownContent />
          </div>
        </div>
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
              <ServeMainMenuDropDown
                key={ID}
                title={<Html2React html={title} />}
                slugPrefix={slug}
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
              <Nav className="flex BAD-menu">
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
  dropDown: {
    backgroundColor: colors.lightSilver,
    border: "none",
  },
  link: {
    color: colors.textMain,
    fontSize: 15,
    textTransform: "capitalize",
  },
};

export default connect(Navigation);
