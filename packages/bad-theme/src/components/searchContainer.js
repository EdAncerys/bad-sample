import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import { muiQuery } from "../context";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setFilterAction } from "../context";

const SearchContainer = ({
  state,
  actions,
  title,
  width,
  searchFilterRef,
  handleSearch,
  padding,
  onChange,
  inputOnly,
}) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();

  const ctaHeight = 45;
  const WIDTH = !lg ? width || "100%" : "100%";

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
          fontSize: !lg ? 36 : 25,
          alignItems: "center",
          paddingBottom: `0.5em`,
        }}
      >
        {title}
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

    const ServeSerachButton = () => {
      if (inputOnly) return null;

      return (
        <div
          style={{
            display: "grid",
            alignItems: "center",
            paddingLeft: !lg ? `2em` : 0,
            paddingTop: !lg ? null : "1em",
          }}
        >
          <button type="submit" className="blue-btn" onClick={handleSearch}>
            Search
          </button>
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
        <ServeSerachButton />
      </div>
    );
  };

  return (
    <div style={{ padding: padding || `1em 0` }}>
      <div className="flex-col">
        <ServeTitle />
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
