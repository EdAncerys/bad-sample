import { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { Dropdown, DropdownButton, NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const NavigationActions = ({ state, actions }) => {
  const [wpMenu, setWpMenu] = useState([]);

  useEffect(() => {
    const data = state.source.data[`/menu/primary-menu/`].items;
    setWpMenu(data);
  }, []);

  // SERVERS ---------------------------------------------
  const ServeDropDownMenu = ({ item }) => {
    const { title, slug, child_items } = item;

    return (
      <div className="dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="btn-m" style={styles.dropDownBtn}>
            {title}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ backgroundColor: colors.lightSilver }}>
            {child_items.map((item) => {
              const { title, slug } = item;

              return (
                <div key={item.ID}>
                  <Dropdown.Item href={`${slug}`}>{title}</Dropdown.Item>
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
    console.log(item);

    if (item.child_items) return <ServeDropDownMenu item={item} />;

    return (
      <div>
        <Link link={`${slug}`} style={styles.link}>
          {title}
        </Link>
      </div>
    );
  };

  return (
    <div>
      <div className="flex-row" style={styles.container}>
        <Link link="/" style={styles.link}>
          Guidance & Standards
        </Link>
        <Link link="/" style={styles.link}>
          Clinical Services
        </Link>
        <Link link="/" style={styles.link}>
          Education & Training
        </Link>
        <Link link="/" style={styles.link}>
          Events
        </Link>
        <Link link="/" style={styles.link}>
          Journal & Research
        </Link>
        <Link link="/" style={styles.link}>
          Membership
        </Link>

        {/* <ServeDropDownMenu /> */}
      </div>
      <div className="flex-row" style={styles.container}>
        {wpMenu.map((item) => {
          return <ServeMainNavigation key={item.ID} item={item} />;
        })}
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
  link: {
    color: colors.textMain,
    fontSize: 15,
    fontTransform: "capitalize",
  },
};

export default connect(NavigationActions);
