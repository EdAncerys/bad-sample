import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setGoToAction } from "../../context";
import Link from "@frontity/components/link";

import BlockWrapper from "../blockWrapper";
import Loading from "../loading";
import Card from "../../components/card/card";

const Navigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);
  const [featured, setFeatured] = useState([]);
  const useEffectRef = useRef(false);

  const MAIN_NAV_LENGTH = 6; // main navigation length config
  const host = "https://badadmin.skylarkdev.co/";

  // active menu slug ref
  const activeMenu = useRef(null);
  const activeChildMenu = useRef(null);

  useEffect(async () => {
    // ⬇️ getting wp menu & featured from state
    if (!state.theme.menu) return;
    const menuData = state.theme.menu;
    const menuLength = menuData.length;

    const wpMainMenu = menuData.slice(0, MAIN_NAV_LENGTH);
    const wpMoreMenu = menuData.slice(MAIN_NAV_LENGTH, menuLength);

    setWpMainMenu(wpMainMenu); // main menu to display
    setWpMoreMenu(wpMoreMenu); // more menu into dropdown
    if (state.source.menu_features)
      setFeatured(Object.values(state.source.menu_features)); // cpt for menu content

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [state.theme.menu]);

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

  const handleOnClickNavigation = ({ parentSlug }) => {
    const childMenuSelector = document.querySelector(
      `#${parentSlug}-child-menu`
    );
    if (childMenuSelector) childMenuSelector.style.display = "none";
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

      const ServeSubChildMenu = ({ child_items, parent, slug }) => {
        if (!child_items) return null;

        let linkPath = parent.url;
        // strip down trailing host from url
        if (linkPath.includes(host)) linkPath = linkPath.replace(host, "");

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
            <div className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                style={{
                  ...styles.link,
                  borderBottom: `1px solid ${colors.silverFillTwo}`,
                  fontWeight: "bold",
                  marginRight: 30,
                }}
                onClick={() =>
                  handleOnClickNavigation({
                    parentSlug: parent.slug,
                  })
                }
                link={linkPath}
              >
                <Html2React html={parent.title} />
              </Link>
            </div>

            <div style={{ paddingRight: `2em` }}>
              {child_items.map((item, key) => {
                const { title, url, slug, child_items } = item;

                let subChildTitle = title.replace(/’/g, "");
                let linkPath = url;
                // strip down trailing host from url
                if (linkPath.includes(host))
                  linkPath = linkPath.replace(host, "");

                return (
                  <li key={key} className="flex-row" style={{ width: "100%" }}>
                    <Link
                      className="flex-row dropdown-item"
                      style={styles.link}
                      onClick={() =>
                        handleOnClickNavigation({
                          parentSlug: parentSlug || "more",
                        })
                      }
                      link={linkPath}
                    >
                      <div className="flex">
                        <div className="menu-title">
                          <Html2React html={subChildTitle} />
                        </div>
                      </div>
                    </Link>
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

      const ServeFeaturedMenu = ({ featuredBannerOne, featuredBannerTwo }) => {
        if (!featuredBannerOne && !featuredBannerTwo) return null;

        const { title, content, acf } = featuredBannerOne || featuredBannerTwo;
        console.log("acf", acf); // debug
        let isLeft = "35%";
        if (featuredBannerTwo) isLeft = "66.5%";

        const isFile = acf.file;
        let linkPath = acf.link;
        const wpHost = state.auth.WP_HOST;
        // strip down trailing host from url
        if (linkPath.includes(wpHost)) linkPath = linkPath.replace(wpHost, "");

        return (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              height: "100%",
              width: "30%",
              left: isLeft,
              margin: `0 1em`,
            }}
          >
            <Card
              featuredBanner={featuredBannerOne || featuredBannerTwo}
              title={title ? title.rendered : null}
              body={content ? content.rendered : null}
              bodyLimit={4}
              link_label="Read More"
              link={linkPath}
              downloadFile={isFile ? { file: isFile } : null} // optional param
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
            <ServeFeaturedMenu featuredBannerOne={featuredBannerOne} />
            <ServeFeaturedMenu featuredBannerTwo={featuredBannerTwo} />

            {child_items.map((item, key) => {
              const { title, url, slug, child_items } = item;

              let linkPath = url;
              // strip down trailing host from url
              if (linkPath.includes(host))
                linkPath = linkPath.replace(host, "");

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
                  style={{
                    width: "100%",
                    borderBottom: `1px solid ${colors.silverFillTwo}`,
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
                  <Link
                    className="flex-row dropdown-item"
                    style={{ ...styles.link, fontWeight: "bold" }}
                    onClick={() =>
                      handleOnClickNavigation({
                        parentSlug: parentSlug || "more",
                      })
                    }
                    link={linkPath}
                  >
                    <div className="flex">
                      <div className="menu-title">
                        <Html2React html={title} />
                      </div>
                    </div>
                    <ServeMenuArrow />
                  </Link>

                  <ServeSubChildMenu
                    child_items={child_items}
                    slug={slug}
                    parent={item}
                  />
                </li>
              );
            })}
          </div>
        </ul>
      );
    };

    if (secondaryMenu) {
      let featuredBannerOne = null; // featured menu item
      let featuredBannerTwo = null; // featured menu item

      featured.map((item) => {
        const id = item.acf.location.split("_")[0];
        const location = item.acf.location.split("_").pop();

        if (id === "more" && location === "0") featuredBannerOne = item; // featured menu item
        if (id === "more" && location === "1") featuredBannerTwo = item; // featured menu item
      });

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
            <ServeChildMenu
              item={{ child_items: wpMoreMenu }}
              featuredBannerOne={featuredBannerOne}
              featuredBannerTwo={featuredBannerTwo}
            />
          </li>
        </ul>
      );
    }

    return (
      <div className="flex main-menu-container" style={styles.container}>
        {wpMainMenu.map((item, key) => {
          const { title, slug, url, db_id } = item;
          let featuredBannerOne = null; // featured menu item
          let featuredBannerTwo = null; // featured menu item

          featured.map((item) => {
            const id = item.acf.location.split("_")[0];
            const location = item.acf.location.split("_").pop();

            if (Number(id) === db_id && location === "0")
              featuredBannerOne = item; // featured menu item
            if (Number(id) === db_id && location === "1")
              featuredBannerTwo = item; // featured menu item
          });

          let linkPath = url;
          // strip down trailing host from url
          if (linkPath.includes(host)) linkPath = linkPath.replace(host, "");
          // console.log("url", url); // debug
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
                <Link
                  className="nav-link dropdown-toggle"
                  style={styles.link}
                  onClick={() =>
                    handleOnClickNavigation({
                      parentSlug: slug,
                    })
                  }
                  link={linkPath}
                >
                  <Html2React html={title} />
                </Link>
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
