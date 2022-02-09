import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

const SearchDropDown = ({
  state,
  actions,
  libraries,
  filter,
  onClickHandler,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!filter) return null;

  const ctaHeight = 45;
  const BANNER_HEIGHT = state.theme.bannerHeight;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 99,
        left: 0,
        top: ctaHeight + 10,
        right: 0,
        marginTop: 10,
        border: `1px solid ${colors.silver}`,
        borderRadius: 10,
        backgroundColor: colors.white,
      }}
    >
      <div className="flex">
        <div
          style={{
            minHeight: ctaHeight,
            maxHeight: BANNER_HEIGHT / 2,
            borderRadius: 10,
            padding: `0.5em 1em`,
            overflow: "auto",
          }}
        >
          {filter.map((item, key) => {
            if (!item.title) return null;
            const { link, title } = item;

            const isNoResults = title === "No Results";

            return (
              <div
                className={isNoResults ? "" : "title-link-animation"}
                key={key}
                style={{ padding: `0.5em 0`, cursor: "pointer" }}
                onClick={() => onClickHandler({ link })}
              >
                <Html2React html={title.rendered} />
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
