import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Dropdown } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import { MENU_DATA } from "../../config/data";

const QuickLinksDropDown = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // SERVERS ----------------------------------------------------------
  const ServeDivider = () => {
    return (
      <div className="relative">
        <div
          style={{
            position: "absolute",
            height: 25,
            width: 145,
            backgroundColor: colors.lightSilver,
            top: -25,
            right: 0,
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
              className="flex-row quick-links"
              style={{
                padding: `0 2em`,
              }}
            >
              <Dropdown.Item
                onClick={() => setGoToAction({ path: url, actions })}
                style={{
                  padding: `1em 0`,
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
    <div className="dropdown dropdown-basic">
      <div>
        <Dropdown align="end">
          <Dropdown.Toggle variant="shadow-none btn-m drop-down-btn">
            Quick Links
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <ServeDivider />
            <ServeMenu />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
    minWidth: 240,
    paddingBottom: `1em`,
  },
};

export default connect(QuickLinksDropDown);
