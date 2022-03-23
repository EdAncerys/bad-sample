import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import parse from "html-react-parser";
import { styled, keyframes, css } from "frontity";

import { setGoToAction } from "../context";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../context";

const RowButton = ({
  state,
  actions,
  libraries,
  block,
  onClick,
  multiPostRowButtons,
}) => {
  const [isHover, setIsHover] = useState(false);
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const dispatch = useAppDispatch();

  let {
    title,
    colour,
    link,
    contact_form,
    allow_attachments,
    recipients,
    link_id,
    file_link,
  } = block;

  // initialize new enquireAction object
  let enquireAction = { ...block };
  // default to defaultContactList if no recipients are set
  if (!enquireAction.recipients) {
    // recipients = state.theme.defaultContactList;
    console.log("📧 contact list", state.contactList.defaultContactList); // debug
    enquireAction.recipients = state.contactList.defaultContactList;
    // enquireAction.recipients = [{ email: "ed@skylarkcreative.co.uk" }];
  }

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
  const arrowStyle = {
    fill: isHover ? "white" : THEME,
    backgroundColor: isHover ? THEME : "white",
    borderRadius: `50%`,
    border: `1px ${THEME}`,
    borderStyle: `solid`,
    padding: 0,
    cursor: "pointer",
    boxShadow: isHover ? `inset 0 3.25em 0 0 ${THEME}` : null,
    transitionDuration: 1000,
    transitionProperty: "all",
  };
  const ServeButton = () => {
    return (
      <div
        className="flex-col"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex-col row-btn">
          <div className="flex-row" style={{ alignItems: "center" }}>
            <div className="flex">
              <div
                className={!multiPostRowButtons ? "caps-btn" : "mp-row-button"}
              >
                <Html2React html={LABEL} />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                paddingLeft: `1em`,
              }}
            >
              <KeyboardArrowRightIcon style={arrowStyle} />
            </div>
          </div>
        </div>
        <ServeFooter />
      </div>
    );
  };

  return (
    <div
      className="flex shadow"
      style={{
        backgroundColor: colors.white,
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => {
        if (link_id) {
          window.location.href = "#" + link_id;
          return;
        }
        if (file_link) {
          window.open(file_link.url);
          return;
        }
        if (onClick) {
          onClick();
          return;
        }
        if (contact_form) {
          setEnquireAction({
            dispatch,
            // ⬇️ contact form config. Defaults to general contacts if values not provided to contact form ⬇️
            enquireAction,
          });
          return;
        }
        if (link) {
          setGoToAction({ path: link.url, actions });
          return;
        }
      }}
    >
      <ServeButton />
    </div>
  );
};

const styles = {
  conteiner: {},
};

const arrow = (isHover, THEME) => css`
  fill: ${isHover ? "white" : THEME};
  background-color: ${isHover ? THEME : "white"};
  border-radius: 50%;
  border: 1px ${THEME};
  border-style: solid;
  padding: 0;
  cursor: pointer;
  box-shadow: ${isHover === true ? `inset 0 3.25em 0 0 ${THEME}` : "none"};
  transition: all 0.3s ease-in-out;
`;

export default connect(RowButton);
