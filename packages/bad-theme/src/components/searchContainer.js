import React, { useState } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import { muiQuery } from "../context";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setFilterAction } from "../context";

const SearchContainer = ({
  title,
  subTitle,
  width,
  searchFilterRef,
  handleSearch,
  padding,
  onChange,
  inputOnly,
  isFetching,
}) => {
  const { lg } = muiQuery();

  const dispatch = useAppDispatch();

  const ctaHeight = 45;
  const WIDTH = !lg ? width || "100%" : "100%";

  // HANDLERS ---------------------------------------------
  const handleKeyPress = (e) => {
    if (isFetching) return;
    if (e.key === "Enter" && e.target.value) {
      handleSearch({ e });
    }
  };

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: !lg ? 26 : 24,
          alignItems: "center",
          paddingBottom: `0.5em`,
        }}
      >
        {title}
      </div>
    );
  };

  const ServeSubTitle = () => {
    if (!subTitle) return null;

    return (
      <div
        style={{
          fontSize: 16,
          alignItems: "center",
          paddingBottom: `0.5em`,
        }}
      >
        {subTitle}
      </div>
    );
  };

  const ServeSearchContainer = () => {
    const [value, setValue] = useState("");

    const handleOnChange = ({ e }) => {
      setValue(e.target.value);
      if (onChange) handleSearch();
    };

    const ServeIcon = () => {
      const searchIcon = <SearchIcon />;
      const closeIcon = <CloseIcon />;
      const icon = value ? closeIcon : searchIcon;

      if (isFetching)
        return (
          <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
        );

      return (
        <div
          onClick={() => {
            setValue("");
            searchFilterRef.current.value = "";
            if (onChange) setFilterAction({ dispatch, filter: null }); // reset main search filter
          }}
        >
          {icon}
        </div>
      );
    };

    const ServeSearchButton = () => {
      if (inputOnly) return null;

      return (
        <div
          style={{
            display: "grid",
            alignItems: "center",
            paddingLeft: !lg ? `2em` : `0.5em`,
            paddingTop: !lg ? null : "1em",
          }}
        >
          <div className="blue-btn" onClick={handleSearch}>
            Search
          </div>
        </div>
      );
    };

    return (
      <div className={!lg ? "flex-row" : "flex-col"}>
        <div
          className="flex"
          style={{
            flex: 1,
            height: ctaHeight,
            position: "relative",
            margin: "auto 0",
          }}
        >
          <input
            ref={searchFilterRef}
            value={value}
            onChange={(e) => handleOnChange({ e })}
            onKeyPress={(e) => handleKeyPress(e)}
            type="text"
            className="form-control"
            placeholder="Search"
            style={!lg ? styles.input : { padding: "1em" }}
          />
          <div
            className="input-group-text toggle-icon-color"
            style={{
              position: "absolute",
              right: 0,
              height: ctaHeight,
              border: "none",
              background: "transparent",
              alignItems: "center",
              color: colors.darkSilver,
              cursor: "pointer",
            }}
          >
            <ServeIcon />
          </div>
        </div>
        <ServeSearchButton />
      </div>
    );
  };

  return (
    <div className="flex no-selector" style={{ padding: padding || `1em 0` }}>
      <div className="flex-col">
        <ServeTitle />
        <ServeSubTitle />
        <div style={{ width: WIDTH }}>
          <ServeSearchContainer />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SearchContainer);
