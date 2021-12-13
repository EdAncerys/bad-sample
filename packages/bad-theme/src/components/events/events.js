import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";
import EventLoopBlock from "./eventLoopBlock";

import Loading from "../loading";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import TitleBlock from "../titleBlock";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const Events = ({ state, actions, libraries, block }) => {
  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [searchFilter, setSearchFilter] = useState(null);
  const [gradesFilter, setGradesFilter] = useState(null);
  const [locationsFilter, setLocationsFilter] = useState(null);
  const [ready, isReady] = useState(false);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const search = block.add_search_function;

  useEffect(() => {
    let GRADES = null;
    let LOCATIONS = null;
    if (state.source.event_grade)
      GRADES = Object.values(state.source.event_grade);
    if (state.source.event_location)
      LOCATIONS = Object.values(state.source.event_location);

    setGrades(GRADES);
    setLocations(LOCATIONS);
    isReady(true);
  }, [state.source.event_grade, state.source.event_location]);

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector("#searchInput").value;

    const serveFilterOne = document.querySelector("#serveFilterOne").value;
    const serveFilterTwo = document.querySelector("#serveFilterTwo").value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveFilterOne) setGradesFilter(serveFilterOne);
    if (!!serveFilterTwo) setLocationsFilter(serveFilterTwo);
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
            <option value="">Event Grades</option>
            {grades.map((item, key) => {
              return (
                <option key={key} value={item.id}>
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
            <option value="">Location</option>
            {locations.map((item, key) => {
              return (
                <option key={key} value={item.id}>
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

  const ServeFilter = () => {
    if (!search) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div style={styles.action}>
          <div>{searchFilter}</div>
          <div style={styles.closeAction} onClick={() => setSearchFilter(null)}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    const ServeGradesFilter = () => {
      if (!gradesFilter) return null;
      const GRADES = Object.values(state.source.event_grade);
      const filter = GRADES.filter((item) => item.id === Number(gradesFilter));
      const name = filter[0].name;

      return (
        <div style={styles.action}>
          <div>{name}</div>
          <div style={styles.closeAction} onClick={() => setGradesFilter(null)}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    const ServeLocationsFilter = () => {
      if (!locationsFilter) return null;
      const LOCATIONS = Object.values(state.source.event_location);
      const filter = LOCATIONS.filter(
        (item) => item.id === Number(locationsFilter)
      );
      const name = filter[0].name;

      return (
        <div style={styles.action}>
          <div>{name}</div>
          <div
            style={styles.closeAction}
            onClick={() => setLocationsFilter(null)}
          >
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div style={{ position: "relative", paddingBottom: `1em` }}>
        <div className="flex-row">
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex">
          <ServeSearchFilter />
          <ServeGradesFilter />
          <ServeLocationsFilter />
        </div>
      </div>
    );
  };

  if (!ready) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `${marginVertical}px ${marginHorizontal}px 0` }}>
      <TitleBlock block={block} disableMargin />
      <ServeFilter />
      <EventLoopBlock
        block={block}
        searchFilter={searchFilter}
        gradesFilter={gradesFilter}
        locationsFilter={locationsFilter}
      />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
  action: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
  closeAction: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.silverFill,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(Events);
