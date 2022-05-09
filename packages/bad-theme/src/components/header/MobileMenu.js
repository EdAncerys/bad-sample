import React from "react";
import { connect } from "frontity";
import { Nav } from "react-bootstrap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  setGoToAction,
  useAppState,
  setErrorAction,
  useAppDispatch,
} from "../../context";

import { MENU_DATA } from "../../config/data";
import { colors } from "../../config/imports";
export default connect(({ libraries, state, actions }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [menuContent, setMenuContent] = React.useState();
  const [wpMainMenu, setWpMainMenu] = React.useState([]);
  const [wpMoreMenu, setWpMoreMenu] = React.useState([]);
  const { isActiveUser, refreshJWT } = useAppState();
  const dispatch = useAppDispatch();

  const setMenu = (children) => {
    setMenuContent(children);
  };

  const onClickLinkHandler = async ({ title, url }) => {
    console.log("TITLERERO", title);
    const isWileys = title.includes("Journal") && !title.includes("Journals");
    let authLink = url;

    // HANDLERS ----------------------------------------------------
    const handelLogin = () => {
      setErrorAction({ dispatch, isError: null });
      loginAction({ state });
    };

    const handelRedirect = () => {
      setErrorAction({ dispatch, isError: null });
      setGoToAction({ state, path: authLink, actions });
    };

    // 📌 check if logged in user exists & user is BAD member to replace auth link
    if (isWileys && isActiveUser) {
      authLink = await getWileyAction({
        state,
        dispatch,
        refreshJWT,
        isActiveUser,
        isFullAccess: true,
        url,
      });
    }

    if (isWileys && !isActiveUser) {
      // 📌 track notification error action
      setErrorAction({
        dispatch,
        isError: {
          message: `BAD members, make sure you are logged in to your BAD account to get free access to our journals. <br/> To continue to the publication without logging in, click to visit the BJD website`,
          image: "Error",
          action: [
            {
              label: `Read ${title}`,
              handler: handelRedirect,
            },
            { label: "Login", handler: handelLogin },
          ],
        },
      });
      return;
    }

    setGoToAction({ state, path: authLink, actions });
  };
  const MenuNavItem = ({ item }) => {
    return (
      <div className="row" style={styles.navItem}>
        <div className="col-11">
          <Html2React html={item.title} />
        </div>
        <div className="col-1">
          <ArrowForwardIosIcon fontSize="small" />
        </div>
      </div>
    );
  };

  const ServeMainMenu = () => {
    return wpMainMenu.map((menu, key) => {
      return (
        <Nav.Link
          key={key}
          onClick={() => {
            if (menu.child_items) {
              setMenuContent({
                main_title: menu.title,
                main_slug: menu.slug,
                main_url: menu.url,
                children: menu.child_items,
              });
            } else {
              onClickLinkHandler({ title: menu.title, url: menu.url });
              // toggleMobileMenu();
            }
          }}
          style={styles.navMenuItem}
        >
          <MenuNavItem item={menu} />
        </Nav.Link>
      );
    });
  };

  React.useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;
    const dataLength = data.length;

    setWpMainMenu(data); // main menu to display
    setWpMoreMenu(data); // more menu into dropdown
  }, [state.theme.menu]);

  if (menuContent) {
    return (
      <div style={styles.container}>
        <Nav.Link onClick={() => setMenuContent(null)}> Go Back</Nav.Link>
        {menuContent.main_title ? (
          <Nav.Link
            style={{
              ...styles.navItem,
              ...styles.navMenuItem,
              fontWeight: "bold",
            }}
            onClick={() =>
              setGoToAction({ state, path: menuContent.main_url, actions })
            }
          >
            <Html2React html={menuContent.main_title} />
          </Nav.Link>
        ) : null}

        {menuContent.children.map((item) => {
          return (
            <Nav.Link
              style={styles.navMenuItem}
              onClick={() => {
                onClickLinkHandler({ title: item.title, url: item.url });
                // setGoToAction({ state, path: item.url, actions });
                // toggleMobileMenu();
              }}
            >
              <MenuNavItem item={item} />
            </Nav.Link>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={styles.container}
      className="BAD-menu"
      data-aos="fade"
      data-aos-easing="ease-in-sine"
      data-aos-duration="300"
    >
      <Nav.Link
        onClick={() => {
          setMenu({ children: MENU_DATA });
        }}
      >
        <MenuNavItem item={{ title: "Quick Links" }} />
      </Nav.Link>
      <ServeMainMenu />
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
