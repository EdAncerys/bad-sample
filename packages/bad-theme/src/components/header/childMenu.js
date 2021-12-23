import { useState, useEffect } from "react";
import { connect } from "frontity";
import { NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";
import { setGoToAction } from "../../context";

const ChildMenu = ({ state, actions, libraries, slugPrefix, menu }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!state.theme.childMenuRef) return null;
  if (!menu.child_items) return null;

  const parentTitle = state.theme.childMenuRef.title;

  if (menu.title !== parentTitle) return null;
  // console.log(menu); // debug

  return (
    <div
      style={{ minWidth: 200, maxWidth: 400, padding: `1em`, overflow: "auto" }}
    >
      <NavDropdown.Item
        className="pointer"
        style={{
          alignItems: "center",
          padding: `0 0 1em 0`,
          borderBottom: `1px dotted ${colors.darkSilver}`,
        }}
        onClick={() => {
          console.log(menu.url);
          setGoToAction({ path: menu.url, actions });
          state.theme.childMenuRef = "";
        }}
      >
        {parentTitle}
      </NavDropdown.Item>

      <div style={{ padding: `1em 0` }}>
        {menu.child_items.map((item, key) => {
          const { title, url } = item;

          return (
            <div
              key={key}
              className="flex"
              style={{ overflow: "auto", padding: `0.5em 0` }}
            >
              <NavDropdown.Item
                onClick={() => setGoToAction({ path: url, actions })}
              >
                <Html2React html={title} />
              </NavDropdown.Item>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ChildMenu);
