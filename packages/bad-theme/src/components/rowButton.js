import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { setGoToAction } from "../context";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../context";

const RowButton = ({ state, actions, libraries, block, onClick }) => {
  // block: object
  // onClick action
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const dispatch = useAppDispatch();

  const { title, colour, link, contact_form, allow_attachments, recipients } =
    block;
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
      <div
        className="flex-col"
        style={{ padding: `1.5em 1em` }}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            if (!link) return null;
            setGoToAction({ path: link.url, actions });
          }
        }}
      >
        <div className="flex-row" style={{ alignItems: "center" }}>
          <div
            className="flex"
            style={{
              fontSize: 13,
              color: colors.softBlack,
              letterSpacing: 2,
              fontWeight: "bold",
              textTransform: "uppercase",
              justifyContent: "start",
              alignItems: "start",
              cursor: "pointer",
            }}
            onClick={() => {
              if (onClick) {
                onClick();
              } else {
                if (!link) return null;
                setGoToAction({ path: link.url, actions });
              }
            }}
          >
            <Html2React html={LABEL} />
          </div>
          <div style={{ display: "grid", alignItems: "center" }}>
            <KeyboardArrowRightIcon
              style={{
                fill: colors.white,
                backgroundColor: THEME,
                borderRadius: "50%",
                padding: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                if (onClick) {
                  onClick();
                } else {
                  if (!link) return null;
                  setGoToAction({ path: link.url, actions });
                }
              }}
            />
          </div>
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default connect(RowButton);
