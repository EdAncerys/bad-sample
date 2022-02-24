import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setGoToAction, getWpPagesAction } from "../../context";

import NavBarDropDownContent from "./navDropDownContent";
import BlockWrapper from "../blockWrapper";
import Loading from "../loading";
import Card from "../../components/card/card";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);
  const [flatMenu, setFlatMenu] = useState([]);
  const useEffectRef = useRef(false);
  // ⬇️ getting wp menu & featuredMenu from state
  const menuData = state.theme.menu;
  const featuredMenu = state.source.menu_featured;

  const MAIN_NAV_LENGTH = 6; // main navigation length config
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;

  // active menu slug ref
  const activeMenu = useRef(null);
  const activeChildMenu = useRef(null);

  useEffect(async () => {
    if (!menuData) return;
    const menuLength = menuData.length;
    let flatMenu = [];

    const wpMainMenu = menuData.slice(0, MAIN_NAV_LENGTH);
    const wpMoreMenu = menuData.slice(MAIN_NAV_LENGTH, menuLength);
    menuData.map((item) => {
      flatMenu.push(item); // add main menu item
      if (item.child_items) {
        item.child_items.map((child) => {
          flatMenu.push(child); // add child menu item
        });
      }
    });
    // ⬇️ menu page content pre fetch
    await Promise.all(
      flatMenu.map(({ slug }) => actions.source.fetch(`/${slug}`))
    );

    setFlatMenu(flatMenu); // set flat menu
    setWpMainMenu(wpMainMenu); // main menu to display
    setWpMoreMenu(wpMoreMenu); // more menu into dropdown

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!wpMoreMenu.length || !wpMainMenu.length)
    return (
      <div style={{ height: 60 }}>
        <Loading padding="0px" />
      </div>
    );

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
    const childMenuSelector = document.querySelector(`#${slug}-child-menu`);
    const shadowColor = handleBoxShadow(slug);

    if (removeShadow) {
      if (selector) selector.style.boxShadow = "none";
      if (selector) selector.style.color = `${colors.black}`;
      if (childMenuSelector) childMenuSelector.style.display = "none";
      return;
    }
    if (activeMenu.current === slug)
      if (selector) selector.style.boxShadow = shadowColor;
    if (selector) selector.style.color = `${colors.blue}`;
    if (childMenuSelector) childMenuSelector.style.display = "block";
  };

  const handleSubMenu = ({ slug }) => {
    const selector = document.querySelector(`#${slug}-submenu`);

    if (activeChildMenu.current === slug && selector) {
      selector.style.display = "block";
    } else {
      if (selector) selector.style.display = "none";
    }
  };

  const handleOnClickNavigation = ({ path, parentSlug }) => {
    const childMenuSelector = document.querySelector(
      `#${parentSlug}-child-menu`
    );

    if (childMenuSelector) childMenuSelector.style.display = "none";
    if (path) setGoToAction({ path, actions });
  };

  // SERVERS -----------------------------------------------------
  const ServeMenu = ({ secondaryMenu }) => {
    const ServeChildMenu = ({
      item,
      parentSlug,
      featuredBannerOne,
      featuredBannerTwo,
    }) => {
      const { title, slug, url, child_items } = item;

      if (!child_items) return null;
      let slugID = parentSlug;
      if (secondaryMenu) slugID = "more";

      const menuLength = child_items.length;

      const ServeSubChildMenu = ({ child_items, parentKey, slug }) => {
        if (!child_items) return null;

        return (
          <ul
            id={`${slug}-submenu`}
            aria-labelledby="navbarDropdownMenuLink"
            style={{
              position: "absolute",
              zIndex: 1,
              top: `5%`,
              width: "32%",
              height: "90%",
              marginLeft: "32%",
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
                const { title, url, slug, child_items } = item;

                let subChildTitle = title.replace(/’/g, "");

                return (
                  <li key={key} className="flex-row" style={{ width: "100%" }}>
                    <a
                      className="flex-row dropdown-item"
                      style={styles.link}
                      onClick={() =>
                        handleOnClickNavigation({
                          path: url,
                          parentSlug: parentSlug || "more",
                        })
                      }
                    >
                      <div className="flex">
                        <div className="menu-title">
                          <Html2React html={subChildTitle} />
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

      const ServeDivider = ({ nullCondition, left }) => {
        if (nullCondition) return null;

        return (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              backgroundColor: colors.silver,
              height: "90%",
              width: 2,
              left: left || `32.5%`,
              margin: `0 1em`,
            }}
          />
        );
      };

      const ServeFeaturedMenuOne = () => {
        if (!featuredBannerOne) return null;

        const { title, content, featured_media, link } = featuredBannerOne;

        return (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              height: "90%",
              width: "30%",
              left: `35%`,
              margin: `0 1em`,
            }}
          >
            <Card
              featuredBanner={featuredBannerOne}
              title={title ? title.rendered : null}
              body={content ? content.rendered : null}
              link_label="Read More"
              link={link}
              cardHeight="90%"
              colour={colors.white}
              shadow // optional param
            />
          </div>
        );
      };

      const ServeFeaturedMenuTwo = () => {
        if (!featuredBannerTwo) return null;

        const { title, content, featured_media, link } = featuredBannerTwo;

        return (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              height: "90%",
              width: "30%",
              left: `66%`,
              margin: `0 1em`,
            }}
          >
            <Card
              featuredBanner={featuredBannerTwo}
              title={title ? title.rendered : null}
              body={content ? content.rendered : null}
              link_label="Read More"
              link={link}
              cardHeight="90%"
              colour={colors.white}
              shadow // optional param
            />
          </div>
        );
      };

      return (
        <ul
          id={`${slugID}-child-menu`}
          className="dropdown-menu child-menu"
          aria-labelledby="navbarDropdownMenuLink"
        >
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateColumns: `repeat(3, 1fr)`,
              gridTemplateRows: `repeat(12, auto)`,
              gap: `0 2em`,
            }}
          >
            <ServeDivider />
            <ServeFeaturedMenuOne />
            <ServeFeaturedMenuTwo />

            {child_items.map((item, key) => {
              const { title, url, slug, child_items } = item;

              const ServeMenuArrow = () => {
                if (!child_items) return null;

                return (
                  <KeyboardArrowRightIcon
                    id={`${slug}-arrow`}
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
                  style={{ width: "100%" }}
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
                    style={{ ...styles.link, fontWeight: "bold" }}
                    onClick={() =>
                      handleOnClickNavigation({
                        path: url,
                        parentSlug: parentSlug || "more",
                      })
                    }
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
        <ul className="navbar-nav secondary-menu-container">
          <li
            className="nav-item dropdown"
            style={{ paddingLeft: `3em` }}
            onMouseEnter={() => {
              activeMenu.current = null;
              handleActiveMenu({ slug: "more" });
            }}
            onMouseLeave={() => {
              activeMenu.current = null; // clear Ref hook after handler been triggered only!
              handleActiveMenu({ slug: "more", removeShadow: true });
            }}
          >
            <a
              id={`menu-more`}
              className="nav-link dropdown-toggle"
              style={styles.link}
              onClick={() => handleOnClickNavigation({ parentSlug: "more" })}
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
          const { title, slug, url, object_id } = item;
          let featuredId = null; // id associating with featured menu
          let featuredBannerOne = null; // featured menu item
          let featuredBannerTwo = null; // featured menu item

          if (featuredMenu)
            Object.values(featuredMenu).map((featured) => {
              // 🔗 link to featured menu item to wpMainMenu
              if (featured.slug === slug) {
                console.log(slug); // debug
                featuredId = featured.id;
              }
            });

          flatMenu.map(({ object, object_id }) => {
            if (object !== "page") return; // only page object

            const pageItem = state.source[object][Number(object_id)]; // getting page item
            if (!pageItem && !pageItem.menu_featured) return; // if page item not found or not featured

            const { menu_featured, modified } = pageItem;

            if (menu_featured.includes(featuredId)) {
              if (!featuredBannerOne) {
                featuredBannerOne = pageItem;
                return;
              }
              if (!featuredBannerTwo) {
                featuredBannerTwo = pageItem;
                return;
              }

              const modifiedDate = new Date(modified);
              const fmDateOne = new Date(featuredBannerOne.modified);
              const fmDateTwo = new Date(featuredBannerTwo.modified);

              // replace if modified date is newer
              if (modifiedDate > fmDateOne) {
                featuredBannerOne = pageItem;
                return;
              }
              if (modifiedDate > fmDateTwo) {
                featuredBannerTwo = pageItem;
                return;
              }
            }
          });

          // console.log("featuredId", featuredId); // debug
          // console.log("featuredBannerOne", featuredBannerOne); // debug
          // console.log("featuredBannerTwo", featuredBannerTwo); // debug

          return (
            <ul
              id={`menu-${slug}`}
              key={key}
              className="flex navbar-nav"
              style={{ justifyContent: "center" }}
              onMouseEnter={() => {
                activeMenu.current = slug;
                handleActiveMenu({ slug });
              }}
              onMouseLeave={() => {
                activeMenu.current = null; // clear Ref hook after handler been triggered only!
                handleActiveMenu({ slug, removeShadow: true });
              }}
            >
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  style={styles.link}
                  onClick={() =>
                    handleOnClickNavigation({ path: url, parentSlug: slug })
                  }
                >
                  <Html2React html={title} />
                </a>
                <ServeChildMenu
                  item={item}
                  parentSlug={slug}
                  featuredBannerOne={featuredBannerOne}
                  featuredBannerTwo={featuredBannerTwo}
                />
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
        style={{ padding: `0.5em 0` }}
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
