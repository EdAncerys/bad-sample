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

  const handleActiveMenu = ({ slug, removeShadow }) => {
    const selector = document.querySelector(`#menu-${slug}`);
    const shadowColor = handleBoxShadow(slug);

    if (removeShadow) {
      selector.style.boxShadow = "none";
      return;
    }
    if (activeMenu.current === slug) selector.style.boxShadow = shadowColor;
  };

  // SERVERS -----------------------------------------------------
  const ServeMenu = ({ secondaryMenu }) => {
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
              gridTemplateRows: `repeat(7, auto)`,
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
                      <div className="menu-title">
                        <Html2React html={title} />
                      </div>
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
            <ServeMenuChildren item={{ child_items: wpMoreMenu }} />
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
