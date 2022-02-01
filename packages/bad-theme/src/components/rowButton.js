import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import parse from "html-react-parser";

import { setGoToAction } from "../context";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../context";

const RowButton = ({ state, actions, libraries, block, onClick }) => {
  // block: object
  // onClick action
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const dispatch = useAppDispatch();

  const {
    title,
    colour,
    link,
    contact_form,
    allow_attachments,
    recipients,
    link_id,
  } = block;
  const THEME = colour || colors.primary;
  let LABEL = title;
  if (!title && link) LABEL = link.title;

  // SERVERS --------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeAnchorLink = () => {
    if (!link_id) return null;

    return (
      <a
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        href={`#${link_id}`}
      />
    );
  };

  const ServeButton = () => {
    return (
      <div
        className="shadow"
        style={{
          ...styles.container,
          backgroundColor: colors.white,
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => {
          if (link_id) return null;
          if (onClick) {
            onClick();
            return;
          }
          if (contact_form) {
            setEnquireAction({
              dispatch,
              enquireAction: block,
            });
            return;
          }
          if (link) setGoToAction({ path: link.url, actions });
        }}
      >
        <div className="flex-col" style={{ padding: `1.5em 1em` }}>
          <div className="flex-row" style={{ alignItems: "center" }}>
            <div
              className="flex"
              style={{
                fontSize: 13,
                letterSpacing: 2,
                fontWeight: "bold",
                textTransform: "uppercase",
                justifyContent: "start",
                alignItems: "start",
                cursor: "pointer",
              }}
            >
              <span
                value={parse(title)}
                className="title-animation"
                style={{ width: "fit-content" }}
              >
                <Html2React html={LABEL} />
              </span>
            </div>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                paddingLeft: `1em`,
              }}
            >
              <KeyboardArrowRightIcon
                style={{
                  fill: colors.white,
                  backgroundColor: THEME,
                  borderRadius: "50%",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
        <ServeFooter />
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ServeAnchorLink />
      <ServeButton />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  link: { boxShadow: "none", color: "inherit" },
};

export default connect(RowButton);
