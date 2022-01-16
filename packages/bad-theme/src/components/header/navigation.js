import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setGoToAction } from "../../context";

import NavBarDropDownContent from "./navDropDownContent";
import BlockWrapper from "../blockWrapper";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);

  const MAIN_NAV_LENGTH = 6; // main navigation length config
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;

  // active menu slug ref
  const activeMenu = useRef(null);
  const activeChildMenu = useRef(null);

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, MAIN_NAV_LENGTH)); // main menu to display
    setWpMoreMenu(data.slice(MAIN_NAV_LENGTH, dataLength)); // more menu into dropdown
  }, [state.theme.menu]);

  if (!wpMoreMenu.length || !wpMainMenu.length) return null;

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

  const handleActiveMenu = ({ slug, removeShadow }) => {
    const selector = document.querySelector(`#menu-${slug}`);
    const shadowColor = handleBoxShadow(slug);

    if (removeShadow) {
      selector.style.boxShadow = "none";
      return;
    }
    if (activeMenu.current === slug) selector.style.boxShadow = shadowColor;
  };

  const handleSubMenu = ({ slug }) => {
    const selector = document.querySelector(`#${slug}-submenu`);

    if (activeChildMenu.current === slug) {
      selector.style.display = "block";
    } else {
      if (selector) selector.style.display = "none";
    }
  };

  // SERVERS -----------------------------------------------------
  const ServeMenu = ({ secondaryMenu }) => {
    const ServeSubChildMenu = ({ child_items, parentKey, slug }) => {
      if (!child_items) return null;

      return (
        <ul
          id={`${slug}-submenu`}
          aria-labelledby="navbarDropdownMenuLink"
          className="shadow"
          style={{
            position: "absolute",
            zIndex: 1,
            top: `5%`,
            width: "33%",
            height: "90%",
            marginLeft: "30%",
            backgroundColor: colors.lightSilver,
            overflowY: "auto",
            display: "none",
          }}
          onMouseEnter={() => {
            activeChildMenu.current = slug;
            handleSubMenu({ slug });
          }}
          onMouseLeave={() => {
            activeChildMenu.current = null; // clear Ref hook after handler been triggered only!
            handleSubMenu({ slug, removeMenu: true });
          }}
        >
          <div style={{ paddingRight: `2em` }}>
            {child_items.map((item, key) => {
              const { title, url, child_items } = item;

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
                      <div className="menu-title">
                        <Html2React html={title} />
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </div>
        </ul>
      );
    };

    const ServeChildMenu = ({ item }) => {
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
              gridTemplateRows: `repeat(7, auto)`,
              gap: `0 2em`,
            }}
          >
            {child_items.map((item, key) => {
              const { title, url, slug, child_items } = item;

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
                  onMouseEnter={() => {
                    activeChildMenu.current = slug;
                    handleSubMenu({ slug });
                  }}
                  onMouseLeave={() => {
                    activeChildMenu.current = null; // clear Ref hook after handler been triggered only!
                    if (child_items) {
                      setTimeout(() => {
                        handleSubMenu({ slug, removeMenu: true });
                      }, 200);
                    } else {
                      handleSubMenu({ slug, removeMenu: true });
                    }
                  }}
                >
                  <a
                    className="flex-row dropdown-item"
                    style={styles.link}
                    onClick={() => setGoToAction({ path: url, actions })}
                  >
                    <div className="flex">
                      <div className="menu-title">
                        <Html2React html={title} />
                      </div>
                    </div>
                    <ServeMenuArrow />
                  </a>
                  <ServeSubChildMenu
                    parentKey={key}
                    child_items={child_items}
                    slug={slug}
                  />
                </li>
              );
            })}
          </div>
        </ul>
      );
    };

    if (secondaryMenu)
      return (
        <ul
          className="navbar-nav secondary-menu-container"
          style={{ paddingLeft: `3em` }}
        >
          <li
            className="nav-item dropdown"
            onMouseEnter={() => {
              activeMenu.current = null;
            }}
          >
            <a
              id={`menu-more}`}
              className="nav-link dropdown-toggle"
              style={styles.link}
            >
              <Html2React html={"More"} />
            </a>
            <ServeChildMenu item={{ child_items: wpMoreMenu }} />
          </li>
        </ul>
      );

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
                <ServeChildMenu item={item} />
              </li>
            </ul>
          );
        })}
      </div>
    );
  };

  return (
    <BlockWrapper>
      <nav
        className="navbar navbar-expand-lg roboto"
        style={{ margin: `0 ${marginHorizontal}px` }}
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ServeMenu />
            <ServeMenu secondaryMenu />
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
    cursor: "pointer",
  },
};

export default connect(Navigation);
