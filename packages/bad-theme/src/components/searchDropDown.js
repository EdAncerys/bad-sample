import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

// CONTEXT ----------------------------------------------------------------
import { postTypeHandler } from "../context";

const SearchDropDown = ({
  state,
  actions,
  libraries,
  filter,
  onClickHandler,
  actionHandler,
  marginTop,
  isAppSearch,
  input,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // filter value are one layer deep object with title & link { title: "", link: "" }
  if (!filter) return null;

  const ctaHeight = 45;
  const BANNER_HEIGHT = state.theme.bannerHeight;

  return (
    <div
      className="input"
      style={{
        position: "absolute",
        zIndex: 99,
        left: 0,
        right: 0,
        marginTop: marginTop || 10,
        border: `1px solid ${colors.silver}`,
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
          {isAppSearch && (
            <div
              className="flex transparent-btn"
              style={{ padding: `0.5em 0`, cursor: "pointer" }}
              onClick={() => actionHandler({ filter })}
            >
              See All Results
            </div>
          )}

          {filter.map((item, key) => {
            const { title, type, url } = item;
            // 📌 if item dont have a link dont render it
            if (!url) return null;

            let serachTitle = title;
            if (input) {
              // hilight search string in title & apply className
              const regex = new RegExp(input, "gi");
              serachTitle = title.replace(
                regex,
                `<span class="search-phrase">${input}</span>`
              );
            }

            // ⬇️ define subtitle name based on type
            let name = postTypeHandler({ type }).name;

            return (
              <div
                className="flex-row title-link-animation"
                key={key}
                style={{
                  padding: `0.5em 0`,
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
                onClick={() => onClickHandler({ item })}
              >
                <span style={{ paddingRight: `0.5em` }}>
                  <Html2React html={serachTitle} />.
                </span>
                {type && <Html2React html={name} />}
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
