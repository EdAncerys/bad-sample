import { useState, useEffect } from "react";
import { connect } from "frontity";
import { NavDropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const ChildMenu = ({ state, actions, libraries, slugPrefix, menu }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!state.theme.childMenuRef) return null;
  if (!menu.child_items) return null;
  
  const parentTitle = state.theme.childMenuRef.title;

  if (menu.title !== parentTitle) return null;
  console.log(menu);

  // HELPERS -----------------------------------------------------
  const handleGoToPath = ({ SLUG_PATH }) => {
    actions.router.set(`/${SLUG_PATH}`);
  };

  return (
    <div style={{ minWidth: 200, padding: `1em` }}>
      <div
        className="pointer"
        style={{
          alignItems: "center",
          padding: `0 0 1em 0`,
          borderBottom: `1px dotted ${colors.silver}`,
        }}
        onClick={() => handleGoToPath({ SLUG_PATH: menu.slug })}
      >
        {parentTitle}
      </div>

      {menu.child_items.map((item, key) => {
        const { title, slug } = item;

        const SLUG_PATH = menu.slug + "/" + slug; // combining parent & child path
        
        return (
          <div key={key} className="flex" style={{ overflow: "auto" }}>
            <NavDropdown.Item onClick={() => handleGoToPath({ SLUG_PATH })}>
              <Html2React html={title} />
            </NavDropdown.Item>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ChildMenu);
