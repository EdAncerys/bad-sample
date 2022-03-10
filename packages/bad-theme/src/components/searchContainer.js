import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setFilterAction } from "../context";

const SearchContainer = ({
  state,
  actions,
  title,
  subTitle,
  width,
  searchFilterRef,
  handleSearch,
  padding,
  onChange,
  inputOnly,
}) => {
  const dispatch = useAppDispatch();

  const ctaHeight = 45;
  const WIDTH = width || "100%";

  // HANDLERS ---------------------------------------------
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value) {
      handleSearch();
    }
  };

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 26,
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
        className="primary-title"
        style={{
          fontSize: 20,
          alignItems: "center",
          paddingBottom: `0.5em`,
        }}
      >
        {subTitle}
      </div>
    );
  };

  const ServeSearchContainer = () => {
    const [value, setValue] = useState(null);

    const handleOnChange = ({ e }) => {
      setValue(e.target.value);
      if (onChange) handleSearch();
    };

    const ServeIcon = () => {
      const searchIcon = <SearchIcon />;
      const closeIcon = <CloseIcon />;
      const icon = value ? closeIcon : searchIcon;

      return (
        <div
          onClick={() => {
            setValue(null);
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
            paddingLeft: `2em`,
          }}
        >
          <button type="submit" className="blue-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      );
    };

    return (
      <div className="flex-row">
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
            onChange={(e) => handleOnChange({ e })}
            onKeyPress={(e) => handleKeyPress(e)}
            type="text"
            className="form-control"
            placeholder="Search"
            style={styles.input}
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
