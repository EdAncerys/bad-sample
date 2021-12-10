import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";
import EventLoopBlock from "./eventLoopBlock";

import Loading from "../loading";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const Events = ({ state, actions, libraries, block }) => {
  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [searchFilter, setSearchFilter] = useState(null);
  const [gradesFilter, setGradesFilter] = useState(null);
  const [locationsFilter, setLocationsFilter] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    const GRADES = Object.values(state.source.event_grade);
    const LOCATIONS = Object.values(state.source.event_location);

    setGrades(GRADES);
    setLocations(LOCATIONS);
  }, []);

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
    console.log(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeFilters = () => {
    if (!grades && !locations) return null; // props for filter options

    const ServeTitle = () => {
      return (
        <div
          style={{
            fontSize: 20,
            color: colors.black,
            padding: `0 2em`,
          }}
        >
          Filter:
        </div>
      );
    };

    const ServeFilterOne = () => {
      if (!grades) return null;

      return (
        <div className="flex" style={{ paddingRight: `1em` }}>
          <Form.Select
            id="serveFilterOne"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>Event Grades</option>
            {grades.map((item, key) => {
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
      if (!locations) return null;

      return (
        <div className="flex">
          <Form.Select
            id="serveFilterTwo"
            aria-label="Default select example"
            style={styles.input}
          >
            <option>Location</option>
            {locations.map((item, key) => {
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
            flex: 1,
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
              height: 45,
              border: "none",
              background: "transparent",
              alignItems: "center",
              color: colors.darkSilver,
            }}
          >
            <SearchIcon />
          </span>
        </div>
        <div style={{ display: "grid", alignItems: "center" }}>
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
    <div>
      <div
        className="flex-row"
        style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      >
        <ServeSearchContainer />
        <ServeFilters />
      </div>
      <EventLoopBlock block={block} />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
};

export default connect(Events);
