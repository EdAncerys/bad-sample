import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Dropdown } from "react-bootstrap";

import { colors } from "../../config/colors";
import { setGoToAction } from "../../context";
import { MENU_DATA } from "../../config/data";

const QuickLinksDropDown = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // SERVERS ----------------------------------------------------------
  const ServeDivider = () => {
    return (
      <div className="flex">
        <div className="flex" />
        <div
          style={{
            height: 20,
            minWidth: 140,
            backgroundColor: colors.lightSilver,
          }}
        />
      </div>
    );
  };

  const ServeMenu = () => {
    return (
      <div style={{ paddingBottom: `1em` }}>
        {MENU_DATA.map((item, key) => {
          const { title, url } = item;

          return (
            <div
              key={key}
              className="flex-row"
              style={{
                padding: `1em 2em`,
              }}
            >
              <Dropdown.Item
                onClick={() => setGoToAction({ path: url, actions })}
                style={{
                  padding: `0 0 1em`,
                  borderBottom: `1px dotted ${colors.darkSilver}`,
                }}
              >
                <Html2React html={title} />
              </Dropdown.Item>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dropdown">
      <div>
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="shadow-none btn-m"
            style={styles.dropDownBtn}
            id="dropdown-basic"
          >
            Quick Links
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ border: "none", padding: 0 }}>
            <div style={{ marginTop: `-10px` }}>
              <ServeDivider />

              <div style={styles.dropDown}>
                <ServeMenu />
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

const styles = {
  dropDownBtn: {
    fontSize: 16,
    backgroundColor: colors.lightSilver,
    textTransform: "capitalize",
    border: "none",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
    minWidth: 240,
    border: "none",
  },
};

export default connect(QuickLinksDropDown);
