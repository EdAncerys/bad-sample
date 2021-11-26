import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import NavBarDropDownContent from "./navDropDownContent";
import ChildMenu from "./childMenu";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);

  const reference = useRef("");

  const NAV_DIVIDER = 8;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const activeDropDown = state.theme.activeDropDown;

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, NAV_DIVIDER)); // main menu to display
    setWpMoreMenu(data.slice(NAV_DIVIDER, dataLength)); // more menu into dropdown
  }, [state.theme.menu]);

  // HELPERS -----------------------------------------------------
  const handleGoToPath = ({ slug }) => {
    actions.router.set(`/${slug}`);
  };

  // SERVERS -----------------------------------------------------
  const ServeMenuDropDown = ({ title, menu, slugPrefix }) => {
    if (!menu.length) return null;
    const isMoreMenu = title === "More";

    const ServeTitle = ({ title, SLUG_PATH }) => {
      if (!title || !SLUG_PATH) return null;

      return (
        <NavDropdown.Item
          className="pointer"
          style={{
            alignItems: "center",
            padding: `1em 0 1em`,
            borderBottom: `1px dotted ${colors.darkSilver}`,
          }}
          onClick={() => handleGoToPath({ slug: SLUG_PATH })}
          onMouseOver={(e) => {
            if (!e.target.innerText) return null; // prevents passing empty title object

            reference.current = e.target.innerText;
            const title = {
              slug: SLUG_PATH,
              title: reference.current,
            };
            state.theme.childMenuRef = title;
          }}
          // onMouseLeave={(e) => (state.theme.childMenuRef = "")} // clear value on mouseleave
        >
          <div className="flex-row">
            <div className="flex" style={{ textTransform: "capitalize" }}>
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
      );
    };

    return (
      <NavDropdown
        title={<Html2React html={title} /> || "Menu Title"}
        style={{
          position: "static", // static position adding ability for dropdown to move up the scope
          padding: `0 1em`,
          borderBottom: `5px solid ${colors.danger}`,
          // borderBottom: activeDropDown ? `5px solid ${colors.danger}` : "none",
        }}
        // onClick={(e) => {
        //   const title = {
        //     color: `5px solid ${colors.danger}`,
        //     title: e.target.innerText,
        //   };
        //   if (!activeDropDown) state.theme.activeDropDown = title;
        //   if (activeDropDown) state.theme.activeDropDown = null;
        // }} // handle menu underline
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
              width: 400,
            }}
          >
            <ServeTitle title={title} SLUG_PATH={slugPrefix} />
            {menu.map((item, key) => {
              const { title, slug } = item;
              let SLUG_PATH = slug; // combining parent & child path
              if (slugPrefix) SLUG_PATH = slugPrefix + "/" + slug;

              return (
                <div
                  key={key}
                  className="flex-row"
                  style={{ marginLeft: isMoreMenu ? 0 : 20 }}
                >
                  <ServeTitle title={title} SLUG_PATH={SLUG_PATH} />
                </div>
              );
            })}
          </div>
          {menu.map((menu, key) => {
            return <ChildMenu key={key} menu={menu} />;
          })}
          <NavBarDropDownContent />
        </div>
      </NavDropdown>
    );
  };

  const ServeMenu = () => {
    return (
      <div
        className="flex"
        id="BAD-menu-container pink"
        style={styles.container}
      >
        {wpMainMenu.map((item, key) => {
          const { title, slug } = item;

          const TEST_BLOCK = slug.includes("blocks-page")
            ? { color: colors.danger, fontWeight: "bold", fontSize: 20 }
            : {};

          if (item.child_items)
            return (
              <ServeMenuDropDown
                key={key}
                title={title}
                slugPrefix={slug}
                menu={item.child_items}
              />
            );

          return (
            <div key={key}>
              <Nav.Link
                style={{ ...styles.link, ...TEST_BLOCK }}
                onClick={() => handleGoToPath({ slug })}
              >
                <Html2React html={title} />
              </Nav.Link>
            </div>
          );
        })}
        <ServeMenuDropDown title="More" menu={wpMoreMenu} />
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              className="m-2"
            />
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
    paddingTop: 20,
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
