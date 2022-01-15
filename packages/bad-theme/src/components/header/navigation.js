import { useState, useEffect, useRef, createRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setGoToAction } from "../../context";

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

  // active menu slug ref
  const activeMenu = useRef(null);

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, MAIN_NAV_LENGTH)); // main menu to display
    setWpMoreMenu(data.slice(MAIN_NAV_LENGTH, dataLength)); // more menu into dropdown
  }, [state.theme.menu]);

  // HANDLERS ----------------------------------------------------
  const handleBoxShadow = (slug) => {
    switch (slug) {
      case "clinical-services":
        return `inset ${colors.darkGreen} 0px -5px`;
      case "news and media":
        return `inset ${colors.pink} 0px -5px`;
      case "guidelines-and-standards":
        return `inset ${colors.maroon} 0px -5px`;
      case "events-content":
        return `inset ${colors.turquoise} 0px -5px`;
      case "education-training":
        return `inset ${colors.orange} 0px -5px`;
      case "research-journals":
        return `inset ${colors.red} 0px -5px`;
      case "membership":
        return `inset ${colors.yellow} 0px -5px`;

      default:
        return "none";
    }
  };

  const handleMenuHover = ({ onMouseEnter }) => {
    const attractor = document.querySelector(
      `#menu-shadow-${activeMenu.current}`
    );

    if (state.theme.activeMenuItem === null && activeMenu.current !== null)
      activeMenu.current = null; // reset useRef hooks after dropdown dismiss event

    if (activeMenu.current !== activeMenu.current) {
      if (onMouseEnter) {
        attractor.classList.remove("d-none");
      } else {
        attractor.classList.add("d-none");
      }
    }
  };

  const handleActiveMenu = ({ slug, removeShadow }) => {
    const selector = document.querySelector(`#menu-${slug}`);
    const shadowColor = handleBoxShadow(slug);

    if (removeShadow) {
      selector.style.boxShadow = "none";
      return;
    }
    if (activeMenu.current === slug) selector.style.boxShadow = shadowColor;

    console.log(slug);
  };

  // SERVERS -----------------------------------------------------
  const ServeMenuDropDown = ({ title, menu, url }) => {
    if (!menu.length) return null;
    const isMoreMenu = title === "More";

    const ServeTitle = ({ title, url, child_items }) => {
      if (!title || !url) return null;

      const ServeMenuArrow = () => {
        if (!child_items) return null;

        return (
          <KeyboardArrowRightIcon
            style={{
              fill: colors.darkSilver,
              borderRadius: "50%",
              padding: 0,
            }}
          />
        );
      };

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
          onMouseEnter={(e) => {
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
            <ServeMenuArrow />
          </div>
        </NavDropdown.Item>
      );
    };

    return (
      <NavDropdown
        title={<Html2React html={title} /> || "Menu Title"}
        style={{
          display: "flex", // static position adding ability for dropdown to move up the scope
          position: "static",
          height: "100%",
          alignItems: "center",
        }}
        onClick={() => {
          if (isMoreMenu) {
            const activeMenuItem = document.querySelector(
              `#menu-shadow-${activeMenu.current}`
            );
            if (activeMenuItem) activeMenuItem.classList.add("d-none");
            activeMenu.current = null;
            state.theme.activeMenuItem = null;
          }
        }}
      >
        <div
          className="flex"
          style={{
            padding: `2em 4em`,
            height: BANNER_HEIGHT,
            backgroundColor: colors.lightSilver, // nav bar dropdown background color
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
              const { title, url, child_items } = item;

              return (
                <div
                  key={key}
                  className="flex-row"
                  style={{ marginLeft: isMoreMenu ? 0 : `1em` }}
                >
                  <ServeTitle
                    title={title}
                    url={url}
                    child_items={child_items}
                  />
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
          const { title, slug, url, child_items } = item;

          if (child_items)
            return (
              <div
                key={key}
                className={"main-menu-container " + key}
                style={{ height: "100%" }}
                onMouseEnter={() => {
                  activeMenu.current = key;
                  handleMenuHover({ onMouseEnter: true });
                }}
                onMouseLeave={() => {
                  // handleMenuHover({ remove });
                  activeMenu.current = null; // clear Ref hook after handler been triggered only!
                }}
                // onClick={handleActiveMenu}
              >
                <ServeMenuDropDown
                  style={{ height: "100%" }}
                  title={title}
                  url={url}
                  menu={child_items}
                />

                <div
                  id={`menu-shadow-${key}`}
                  className="d-none"
                  style={{
                    backgroundColor: handleBoxShadow(item.slug),
                    height: 5,
                    width: "100%",
                    position: "relative",
                    bottom: 5,
                  }}
                />
              </div>
            );

          return (
            <div key={key}>
              <Nav.Link
                style={styles.link}
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

  const ServeMenuDropDownB = ({ title, menu, url }) => {
    if (!menu.length) return null;
    const isMoreMenu = title === "More";

    const ServeTitle = ({ title, url, child_items }) => {
      if (!title || !url) return null;

      const ServeMenuArrow = () => {
        if (!child_items) return null;

        return (
          <KeyboardArrowRightIcon
            style={{
              fill: colors.darkSilver,
              borderRadius: "50%",
              padding: 0,
            }}
          />
        );
      };

      return (
        <li
          className="flex pointer"
          style={{
            alignItems: "center",
            padding: `1em 0 1em`,
            borderBottom: `1px dotted ${colors.darkSilver}`,
            whiteSpace: "normal",
          }}
          onClick={() => setGoToAction({ path: url, actions })}
          onMouseEnter={(e) => {
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
            <ServeMenuArrow />
          </div>
        </li>
      );
    };

    return (
      <NavDropdown
        title={<Html2React html={title} /> || "Menu Title"}
        style={{
          display: "flex", // static position adding ability for dropdown to move up the scope
          position: "static",
          height: "100%",
          alignItems: "center",
        }}
        onClick={() => {
          if (isMoreMenu) {
            const activeMenuItem = document.querySelector(
              `#menu-shadow-${activeMenu.current}`
            );
            if (activeMenuItem) activeMenuItem.classList.add("d-none");
            activeMenu.current = null;
            state.theme.activeMenuItem = null;
          }
        }}
      >
        <div
          className="flex"
          style={{
            padding: `2em 4em`,
            height: BANNER_HEIGHT,
            backgroundColor: colors.lightSilver, // nav bar dropdown background color
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
              const { title, url, child_items } = item;

              return (
                <div
                  key={key}
                  className="flex-row"
                  style={{ marginLeft: isMoreMenu ? 0 : `1em` }}
                >
                  <ServeTitle
                    title={title}
                    url={url}
                    child_items={child_items}
                  />
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

  const ServeMenuB = () => {
    const ServeMenuChildren = ({ item }) => {
      const { title, slug, url, child_items } = item;

      if (!child_items) return null;

      return (
        <ul
          className="dropdown-menu child-menu"
          aria-labelledby="navbarDropdownMenuLink"
        >
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateColumns: `repeat(3, 1fr)`,
              gridTemplateRows: `repeat(5, auto)`,
              gap: `0 2em`,
            }}
          >
            {child_items.map((item, key) => {
              const { title, url, child_items } = item;

              const ServeMenuArrow = () => {
                if (!child_items) return null;

                return (
                  <KeyboardArrowRightIcon
                    style={{
                      fill: colors.darkSilver,
                      borderRadius: "50%",
                      padding: 0,
                      margin: "auto",
                    }}
                  />
                );
              };

              return (
                <li
                  key={key}
                  className="flex-row"
                  style={{
                    width: "100%",
                    borderBottom: `1px dotted ${colors.darkSilver}`,
                  }}
                >
                  <a
                    className="flex-row dropdown-item"
                    style={styles.link}
                    onClick={() => setGoToAction({ path: url, actions })}
                  >
                    <div className="flex">
                      <Html2React html={title} />
                    </div>
                    <ServeMenuArrow />
                  </a>
                </li>
              );
            })}
          </div>
        </ul>
      );
    };

    return (
      <div className="flex main-menu-container" style={styles.container}>
        {wpMainMenu.map((item, key) => {
          const { title, slug, url, child_items } = item;

          return (
            <ul key={key} className="navbar-nav">
              <li
                className="nav-item dropdown"
                onMouseEnter={() => {
                  activeMenu.current = slug;
                  handleActiveMenu({ slug });
                }}
                onMouseLeave={() => {
                  activeMenu.current = null; // clear Ref hook after handler been triggered only!
                  handleActiveMenu({ slug, removeShadow: true });
                }}
              >
                <a
                  id={`menu-${slug}`}
                  className="nav-link dropdown-toggle"
                  style={styles.link}
                  onClick={() => setGoToAction({ path: url, actions })}
                >
                  <Html2React html={title} />
                </a>
                <ServeMenuChildren item={item} />
              </li>
            </ul>
          );
        })}
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

      <nav
        className="navbar navbar-expand-lg roboto"
        style={{ margin: `0 ${marginHorizontal}px` }}
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ServeMenuB />

            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown link
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    color: colors.softBlack,
    textTransform: "capitalize",
  },
};

export default connect(Navigation);
