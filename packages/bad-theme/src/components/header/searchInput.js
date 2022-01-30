import { useState, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import SearchContainer from "../searchContainer";
import SearchDropDown from "../searchDropDown";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setFilterAction } from "../../context";

const SearchInput = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();

  const searchFilterRef = useRef(null);
  const eventList = Object.values(state.source.events); // add events object to data array

  // HELPERS ---------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();
    if (!input) return null;

    let filter = eventList.filter((event) =>
      event.title.rendered.toLowerCase().includes(input)
    );

    if (!filter.length) filter = [{ title: { rendered: "No Results" } }];
    setFilterAction({ dispatch, filter });
    console.log(input);
  };

  // RETURN ---------------------------------------------
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <SearchContainer
        searchFilterRef={searchFilterRef}
        handleSearch={handleSearch}
        onChange
        inputOnly
      />
      <SearchDropDown />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SearchInput);
