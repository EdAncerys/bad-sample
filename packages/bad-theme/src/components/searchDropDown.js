import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

const SearchDropDown = ({
  state,
  actions,
  libraries,
  filter,
  onClickHandler,
  marginTop,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // filter value are one layer deep object with title & link { title: "", link: "" }
  if (!filter) return null;

  const ctaHeight = 45;
  const BANNER_HEIGHT = state.theme.bannerHeight;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 99,
        left: 0,
        right: 0,
        marginTop: marginTop || 10,
        border: `1px solid ${colors.silver}`,
        borderRadius: 10,
        backgroundColor: colors.white,
      }}
    >
      <div className="flex">
        <div
          className="flex-col"
          style={{
            minHeight: ctaHeight,
            maxHeight: BANNER_HEIGHT / 2,
            borderRadius: 10,
            padding: `0.5em 1em`,
            overflow: "auto",
          }}
        >
          {filter.map((item, key) => {
            return (
              <div
                className="title-link-animation"
                key={key}
                style={{ padding: `0.5em 0`, cursor: "pointer" }}
                onClick={() => onClickHandler({ item })}
              >
                <Html2React html={item.title} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SearchDropDown);
