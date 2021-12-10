import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const EventFilter = ({ state, actions, libraries, handleSetState }) => {
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const GRADES = Object.values(state.source.event_grade);
  const LOCATIONS = Object.values(state.source.event_location);

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector("#searchInput").value;

    const serveFilterOne = document.querySelector("#serveFilterOne").value;
    const serveFilterTwo = document.querySelector("#serveFilterTwo").value;

    const filter = {
      searchInput,
      serveFilterOne,
      serveFilterTwo,
    };
    handleSetState({ filter });
  };

  // SERVERS ---------------------------------------------
  const ServeFilters = () => {
    // if (!filterOne && !filterTwo && !filterThree) return null; // props for filter options

    const ServeTitle = () => {
      return (
        <div
          style={{
            fontSize: 20,
            color: colors.black,
            paddingRight: `2em`,
          }}
        >
          Filter:
        </div>
      );
    };

    const ServeFilterOne = () => {
      if (!GRADES) return null;

      return (
        <div className="flex" style={{ paddingRight: `1em` }}>
          <Form.Select
            id="serveFilterOne"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>Event Grades</option>
            {GRADES.map((item, key) => {
              return (
                <option key={key} value={item.name}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
        </div>
      );
    };

    const ServeFilterTwo = () => {
      if (!LOCATIONS) return null;

      return (
        <div className="flex">
          <Form.Select
            id="serveFilterTwo"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>Location</option>
            {LOCATIONS.map((item, key) => {
              return (
                <option key={key} value={item.name}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
        </div>
      );
    };

    return (
      <div className="flex" style={{ padding: `1em 0`, alignItems: "center" }}>
        <ServeTitle />
        <ServeFilterOne />
        <ServeFilterTwo />
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div className="flex-row">
        <div
          className="flex"
          style={{
            flex: 2,
            marginRight: `2em`,
            padding: `0.75em 0`,
            position: "relative",
          }}
        >
          <input
            id="searchInput"
            type="text"
            className="form-control"
            placeholder="Find An Event"
            style={styles.input}
          />
          <span
            className="input-group-text"
            style={{
              position: "absolute",
              right: 0,
              top: `1.2em`,
              border: "none",
              background: "transparent",
              color: colors.darkSilver,
            }}
          >
            <SearchIcon />
          </span>
        </div>
        <div className="flex" style={{ alignItems: "center" }}>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: `0.5em`,
            }}
            onClick={handleSearchSubmit}
          >
            Search
          </button>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div className="flex">
      <div className="flex-row" style={{ paddingTop: `${marginVertical}px` }}>
        <ServeSearchContainer />
        <ServeFilters />
      </div>
    </div>
  );
};

const styles = {
  container: {},
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
};

export default connect(EventFilter);
