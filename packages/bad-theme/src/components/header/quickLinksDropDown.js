import { useState, useEffect } from "react";
import { connect } from "frontity";

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
            height: 35,
            width: 147,
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
      <ul
        className="dropdown-menu dropdown-menu-end shadow quick-link"
        style={{
          paddingBottom: `2em`,
          marginTop: `1em`,
          border: "none",
          backgroundColor: colors.lightSilver,
        }}
      >
        <ServeDivider />

        {MENU_DATA.map((item, key) => {
          const { title, url } = item;

          return (
            <li
              key={key}
              className="flex-row"
              style={{
                marginRight: `2em`,
                borderBottom: `1px dotted ${colors.darkSilver}`,
              }}
              onClick={() => setGoToAction({ path: url, actions })}
            >
              <a className="dropdown-item" style={{ padding: `0.5em 0` }}>
                <div
                  className="quick-link-title"
                  style={{ width: `fit-content` }}
                >
                  <Html2React html={title} />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="dropdown quick-link">
      <button className="dropdown-toggle drop-down-btn" type="button">
        Quick Links
      </button>
      <ServeMenu />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(QuickLinksDropDown);
