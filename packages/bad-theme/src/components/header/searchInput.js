import { useState, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import SearchContainer from "../searchContainer";
import SearchDropDown from "../searchDropDown";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setFilterAction,
  setGoToAction,
} from "../../context";

const SearchInput = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { filter } = useAppState();

  const searchFilterRef = useRef(null);

  // HELPERS ---------------------------------------------

  // RETURN ---------------------------------------------
  return (
    <div
      style={{ position: "relative", width: "100%" }}
      // onMouseLeave={handleMouseLeave} // clears search input on mouse leave
    >
      <SearchContainer
        searchFilterRef={searchFilterRef}
        handleSearch={() => console.log(searchFilterRef.current.value)}
        onChange
        inputOnly
      />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SearchInput);
