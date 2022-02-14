import React from "react";
import Navigation from "./navigation";
import { connect } from "frontity";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { setGoToAction } from "../../context";

import QuickLinksDropDown from "./quickLinksDropDown";
import { MENU_DATA } from "../../config/data";
import { colors } from "../../config/imports";
export default connect(({ libraries, state, actions, toggleMobileMenu }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [menuContent, setMenuContent] = React.useState();
  const [wpMainMenu, setWpMainMenu] = React.useState([]);
  const [wpMoreMenu, setWpMoreMenu] = React.useState([]);

  const setMenu = (children) => {
    setMenuContent(children);
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
    return wpMainMenu.map((menu) => {
      return (
        <Nav.Link
          onClick={() => {
            if (menu.child_items) {
              setMenuContent({
                main_title: menu.title,
                main_slug: menu.slug,
                main_url: menu.url,
                children: menu.child_items,
              });
            } else {
              setGoToAction({ path: menu.url, actions });
              toggleMobileMenu();
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
    console.log(menuContent);
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
              setGoToAction({ path: menuContent.main_url, actions })
            }
          >
            <Html2React html={menuContent.main_title} />
          </Nav.Link>
        ) : null}

        {menuContent.children.map((item) => {
          console.log(menuContent);
          return (
            <Nav.Link
              style={styles.navMenuItem}
              onClick={() => {
                setGoToAction({ path: item.url, actions });
                toggleMobileMenu();
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
    <div style={styles.container} className="BAD-menu">
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
    top: 80,
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
