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
  margin,
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
          {filter.map((item, key) => {
            const { title, type } = item;
            // console.log("item", item); // debug

            // ⬇️ define subtitle name based on type
            let typeName = "";
            if (type === "derm_groups_charity")
              typeName = "See Dermatology Groups & Charities";
            if (type === "covid_19") typeName = "See in COVID 19";
            if (type === "pils") typeName = "See in PILS";
            if (type === "post") typeName = "See in Posts";
            if (type === "guidelines_standards")
              typeName = "See in Guidelines & Standards";

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
                  <Html2React html={title} />.
                </span>
                {type && <Html2React html={typeName} />}
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
