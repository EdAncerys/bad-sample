import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setGoToAction } from "../../context";

import { setActiveDropDownRef } from "../../context/actions/navigation";
import NavBarDropDownContent from "./navDropDownContent";
import ChildMenu from "./childMenu";
import BlockWrapper from "../blockWrapper";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);

  const childMenuRef = useRef("");

  const MAIN_NAV_LENGTH = 6; // main navigation length config
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, MAIN_NAV_LENGTH)); // main menu to display
    setWpMoreMenu(data.slice(MAIN_NAV_LENGTH, dataLength)); // more menu into dropdown
  }, [state.theme.menu]);

  // SERVERS -----------------------------------------------------
  const ServeMenuDropDown = ({ title, menu, url }) => {
    if (!menu.length) return null;
    const isMoreMenu = title === "More";

    const ServeTitle = ({ title, url }) => {
      if (!title || !url) return null;

      return (
        <NavDropdown.Item
          className="flex pointer"
          style={{
            alignItems: "center",
            padding: `1em 0 1em`,
            borderBottom: `1px dotted ${colors.darkSilver}`,
            whiteSpace: "normal",
          }}
          onClick={() => setGoToAction({ path: url, actions })}
          onMouseOver={(e) => {
            if (!e.target.innerText) return null; // prevents passing empty title object

            childMenuRef.current = e.target.innerText;
            const title = {
              url: url,
              title: childMenuRef.current,
            };
            state.theme.childMenuRef = title;
          }}
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
        }}
        onClick={(e) => {
          const title = {
            color: `5px solid ${colors.danger}`,
            title: e.target.innerHTML,
          };
          setActiveDropDownRef({ state, actions: title });
        }}
      >
        <div
          className="flex"
          style={{
            padding: `2em 4em`,
            height: BANNER_HEIGHT,
            backgroundColor: colors.lightSilver, // nav bar dropdown background color
            // border: `1px solid ${colors.darkSilver}`, // add border for visibility
            boxShadow: `0 0.5rem 1rem rgba(0, 0, 0, 0.15)`,
          }}
        >
          <div
            style={{
              overflow: "auto",
              width: 400,
            }}
          >
            <ServeTitle title={title} url={url} />
            {menu.map((item, key) => {
              const { title, url } = item;

              return (
                <div
                  key={key}
                  className="flex-row"
                  style={{ marginLeft: isMoreMenu ? 0 : `1em` }}
                >
                  <ServeTitle title={title} url={url} />
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
      <div className="flex" style={styles.container}>
        {wpMainMenu.map((item, key) => {
          const { title, slug, url } = item;

          const TEST_BLOCK = slug.includes("blocks-page")
            ? {
                color: colors.danger,
                fontWeight: "bold",
                fontSize: 20,
              }
            : {};

          if (item.child_items)
            return (
              <div key={key} className="bad-menu-container">
                <ServeMenuDropDown
                  title={title}
                  url={url}
                  menu={item.child_items}
                />
              </div>
            );

          return (
            <div key={key}>
              <Nav.Link
                style={{ ...styles.link, ...TEST_BLOCK }}
                onClick={() => setGoToAction({ path: url, actions })}
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
    <BlockWrapper>
      <div className="row roboto">
        <div className="col-md-12">
          <Navbar collapseOnSelect expand="lg">
            <Container>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="m-2"
              />
              <Navbar.Collapse>
                <div
                  className="flex"
                  style={{ height: "4em", margin: `0 ${marginHorizontal}px` }}
                >
                  <Nav className="flex BAD-menu">
                    <ServeMenu />
                  </Nav>
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
    border: "none",
  },
  link: {
    color: colors.textMain,
    textTransform: "capitalize",
  },
};

export default connect(Navigation);
