import { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { Dropdown, DropdownButton, NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const NavigationActions = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const [wpMainMenu, setWpMainMenu] = useState([]);
  const [wpMoreMenu, setWpMoreMenu] = useState([]);
  const NAV_DIVIDER = 8;

  useEffect(() => {
    const data = state.source.data[`/menu/primary-menu/`].items;
    const dataLength = data.length;

    setWpMainMenu(data.slice(0, NAV_DIVIDER));
    setWpMoreMenu(data.slice(NAV_DIVIDER, dataLength));
  }, []);

  // SERVERS ---------------------------------------------
  const ServeNestedMenu = ({ item }) => {
    const { ID, title, slug, child_items } = item;

    return (
      <div>
        <Dropdown.Item key={ID} href={`${slug}`}>
          <Html2React html={title} />
        </Dropdown.Item>
        {child_items.map((item) => {
          const { ID, title, slug } = item;

          return (
            <div
              key={ID}
              style={{
                paddingLeft: 20,
                backgroundColor: colors.lightSilver,
              }}
            >
              <Dropdown.Item href={`${slug}`}>
                <Html2React html={title} />
              </Dropdown.Item>
            </div>
          );
        })}
      </div>
    );
  };

  const ServeMoreMenu = () => {
    if (!wpMoreMenu.length) return null;

    return (
      <div className="dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="btn-m" style={styles.dropDownBtn}>
            More
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ backgroundColor: colors.lightSilver }}>
            {wpMoreMenu.map((item) => {
              const { ID, title, slug } = item;

              if (item.child_items)
                return <ServeNestedMenu key={ID} item={item} />;

              return (
                <div key={ID}>
                  <Dropdown.Item href={`${slug}`}>
                    <Html2React html={title} />
                  </Dropdown.Item>
                </div>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const ServeDropDownMenu = ({ item }) => {
    const { title, slug, child_items } = item;

    return (
      <div className="dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="btn-m" style={styles.dropDownBtn}>
            <Html2React html={title} />
          </Dropdown.Toggle>

          <Dropdown.Menu style={styles.dropDown}>
            {child_items.map((item) => {
              const { ID, title, slug } = item;

              return (
                <div key={ID}>
                  <Dropdown.Item href={`${slug}`}>
                    <Html2React html={title} />
                  </Dropdown.Item>
                </div>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const ServeMainNavigation = ({ item }) => {
    const { title, slug } = item;

    if (item.child_items) return <ServeDropDownMenu item={item} />;

    return (
      <div>
        <Link link={`${slug}`} style={styles.link}>
          <Html2React html={title} />
        </Link>
      </div>
    );
  };

  return (
    <div>
      <div className="flex-row" style={styles.container}>
        {wpMainMenu.map((item) => {
          const { ID } = item;

          return <ServeMainNavigation key={ID} item={item} />;
        })}
        <ServeMoreMenu />
      </div>
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 67,
    flexWrap: "wrap",
  },
  dropDownBtn: {
    color: colors.textMain,
    fontSize: 15,
    backgroundColor: "transparent",
    textTransform: "capitalize",
    border: "none",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
  },
  link: {
    color: colors.textMain,
    fontSize: 15,
    fontTransform: "capitalize",
  },
};

export default connect(NavigationActions);
