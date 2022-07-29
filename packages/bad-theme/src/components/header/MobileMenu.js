import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Nav } from "react-bootstrap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  setGoToAction,
  useAppState,
  setErrorAction,
  useAppDispatch,
  getWileyAction,
  loginAction,
  getMediaCategories,
  Parcer,
} from "../../context";

import { MENU_DATA } from "../../config/data";
import { colors } from "../../config/imports";

export default connect(({ libraries, state, actions, setMobileMenuActive }) => {
  const [menuContent, setMenuContent] = useState(null);
  const [wpMainMenu, setWpMainMenu] = useState(null);
  const { isActiveUser } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(async () => {
    // --------------------------------------------------------------------------------
    // 📌  Add menu data to state forpm context
    // --------------------------------------------------------------------------------
    let data = state.theme.menu;
    if (!data) return;

    // get news & media taxonomy data
    let taxonomyList = await getMediaCategories({ state });
    if (taxonomyList.length > 0) {
      // sort catList by name in alphabetical order
      taxonomyList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        return 0;
      });

      // add url to taxonomyList for each taxonomy item = "/news-media/" & cnahge add title = name
      taxonomyList.forEach((item) => {
        item.url = `/news-media/`;
        item.title = item.name;
      });
    }

    // add taxonomyList to menu data for news & media
    data.forEach((item) => {
      if (item.slug === "news-media") {
        item.child_items = taxonomyList;
      }
    });

    // set menu content as main menu data
    setMenuContent(data);
    setWpMainMenu(data); // main menu content
  }, [state.theme.menu]);

  const onClickLinkHandler = async ({ title, url }) => {
    // check if link is a Wiley link
    const isWileys =
      title && title.includes("Journal") && !title.includes("SHD");
    let authLink = url;
    console.log("🐞 title", title);
    console.log("🐞 authLink", authLink);

    // // HANDLERS ----------------------------------------------------
    // const handelLogin = () => {
    //   setErrorAction({ dispatch, isError: null });
    //   loginAction({ state });
    // };

    // const handleRedirect = () => {
    //   setErrorAction({ dispatch, isError: null });
    //   setGoToAction({ state, path: authLink, actions });
    // };

    // // 📌 check if logged in user exists & user is BAD member to replace auth link
    // if (isWileys && isActiveUser) {
    //   authLink = await getWileyAction({
    //     state,
    //     dispatch,
    //     isActiveUser,
    //     isFullAccess: true,
    //     url,
    //   });
    // }

    // if (isWileys && !isActiveUser) {
    //   // 📌 track notification error action
    //   setErrorAction({
    //     dispatch,
    //     isError: {
    //       message: `BAD members, make sure you are logged in to your BAD account to get free access to our journals. <br/> To continue to the publication without logging in, click 'Continue to Wiley website'`,
    //       image: "Error",
    //       action: [
    //         {
    //           label: `Continue to Wiley website`,
    //           handler: handleRedirect,
    //         },
    //         { label: "Login", handler: handelLogin },
    //       ],
    //     },
    //   });
    //   return;
    // }

    //  page redirect
    setGoToAction({ state, path: authLink, actions });
  };

  const MenuNavItem = ({ item }) => {
    return (
      <div className="row" style={styles.navItem}>
        <div className="col-11">
          <Parcer libraries={libraries} html={item.title} />
        </div>
        <div className="col-1">
          <ArrowForwardIosIcon fontSize="small" />
        </div>
      </div>
    );
  };

  const ServeMenu = () => {
    if (!menuContent) return null;

    return menuContent.map((menu, key) => {
      return (
        <Nav.Link
          key={key}
          onClick={() => {
            const subMenu = menu.child_items;

            if (subMenu) {
              setMenuContent(subMenu);
            } else {
              onClickLinkHandler({ title: menu.title, url: menu.url });

              // disable menu on page naviagtion (toggleMobileMenu)
              setMobileMenuActive(false);
            }
          }}
          style={styles.navMenuItem}
        >
          <MenuNavItem item={menu} />
        </Nav.Link>
      );
    });
  };

  const ServeAditionalLinks = () => {
    // check if menu content is = wpMainMenu
    if (menuContent !== wpMainMenu) {
      return (
        <Nav.Link onClick={() => setMenuContent(wpMainMenu)}>Go Back</Nav.Link>
      );
    }

    return (
      <Nav.Link onClick={() => setMenuContent(MENU_DATA)}>
        <MenuNavItem item={{ title: "Quick Links" }} />
      </Nav.Link>
    );
  };

  if (!wpMainMenu) return null;

  return (
    <div
      style={styles.container}
      className="BAD-menu"
      data-aos="fade"
      data-aos-easing="ease-in-sine"
      data-aos-duration="300"
    >
      <ServeAditionalLinks />
      <ServeMenu />
      <div style={{ height: "50px" }} />
    </div>
  );
});

const styles = {
  container: {
    backgroundColor: "white",
    height: "100vh",
    width: "100%",
    position: "absolute",
    overflow: "scroll",
    top: 71,
    left: 0,
    paddingBottom: 100,
    zIndex: 500,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    minHeight: "5em",
    borderBottomWidth: "2px",
    borderColor: colors.softBlack,
    color: colors.softBlack,
  },
  navMenuItem: {
    backgroundColor: colors.lightSilver,
    borderBottomWidth: "1px",
    borderColor: colors.softBlack,
    borderBottomStyle: "solid",
  },
};
