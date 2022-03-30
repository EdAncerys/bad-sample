import React, { useState } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setEnquireAction, setGoToAction } from "../context";

const RowButton = ({
  state,
  actions,
  libraries,
  block,
  onClick,
  multiPostRowButtons,
  delay,
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

  // ⬇️ initialize new enquireAction object & update object with new values
  let enquireAction = {
    ...block,
    // default email subject & template name
    emailSubject: "Standard Enquiry Form B.A.D WebApp",
    emailTemplate: "StandardEnquiryForm",
  };
  // default to DEFAULT_CONTACT_LIST if no recipients are set
  if (!enquireAction.recipients) {
    // recipients = state.theme.DEFAULT_CONTACT_LIST;
    enquireAction.recipients = state.contactList.DEFAULT_CONTACT_LIST;
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
    backgroundColor: isHover ? `${THEME}` : "white",
    borderRadius: `50%`,
    border: `1px ${THEME}`,
    borderStyle: `solid`,
    padding: 0,
    cursor: "pointer",
    boxShadow: isHover ? `inset 0 40px 0 0 ${THEME}` : null,
    transform: isHover ? `translate(5px, 0)` : `translate(0, 0)`,
    transition: `background-color 1s, transform 1s`,
  };

  return (
    <div
      className="flex shadow"
      style={{
        backgroundColor: colors.white,
        cursor: "pointer",
        position: "relative",
      }}
      data-aos="fade"
      data-aos-easing="ease-in-sine"
      data-aos-delay={`${delay * 50}`}
      data-aos-duration="1000"
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
    </div>
  );
};

const styles = {
  conteiner: {},
};

export default React.memo(connect(RowButton));
