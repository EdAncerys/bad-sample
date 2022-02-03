import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import EventLoopBlock from "./eventLoopBlock";
import SearchContainer from "../searchContainer";
import Loading from "../loading";
import { colors } from "../../config/imports";

import CloseIcon from "@mui/icons-material/Close";

const Events = ({ state, actions, libraries, block }) => {
  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [searchFilter, setSearchFilter] = useState(null);
  const [gradesFilter, setGradesFilter] = useState(null);
  const [locationsFilter, setLocationsFilter] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const searchFilterRef = useRef(null);
  const gradeRef = useRef(null);
  const locationRef = useRef(null);

  const isSearch = block.add_search_function;
  const id = uuidv4();

  useEffect(() => {
    let GRADES = null;
    let LOCATIONS = null;
    if (state.source.event_grade)
      GRADES = Object.values(state.source.event_grade);
    if (state.source.event_location)
      LOCATIONS = Object.values(state.source.event_location);

    setGrades(GRADES);
    setLocations(LOCATIONS);
    setIsReady(true);
  }, [state.source.event_grade, state.source.event_location]);

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();

    const grade = gradeRef.current.value;
    const location = locationRef.current.value;

    console.log(input, location, grade);

    if (!!input) setSearchFilter(input);
    if (!!grade) setGradesFilter(grade);
    if (!!location) setLocationsFilter(location);
  };

  // SERVERS ---------------------------------------------
  const ServeFilters = () => {
    if (!grades && !locations) return null; // props for filter options

    const ServeTitle = () => {
      return (
        <div
          className="primary-title"
          style={{ fontSize: 20, paddingRight: `2em` }}
        >
          Filter:
        </div>
      );
    };

    const ServeGradeFilter = () => {
      if (!grades) return null;

      return (
        <div className="flex" style={{ paddingRight: `1em` }}>
          <Form.Select ref={gradeRef} style={styles.input}>
            <option value="" hidden>
              Event Grades
            </option>
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

    const ServeLocationFilter = () => {
      if (!locations) return null;

      return (
        <div className="flex">
          <Form.Select ref={locationRef} style={styles.input}>
            <option value="" hidden>
              Location
            </option>
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
        <ServeGradeFilter />
        <ServeLocationFilter />
      </div>
    );
  };

  const ServeFilter = () => {
    if (!isSearch) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={() => setSearchFilter(null)}>
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

    const ServeSelectedGradesFilter = () => {
      if (!gradesFilter) return null;
      const GRADES = Object.values(state.source.event_grade);
      const filter = GRADES.filter((item) => item.id === Number(gradesFilter));
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setGradesFilter(null)}>
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

    const ServeSelectedLocationFilter = () => {
      if (!locationsFilter) return null;
      const LOCATIONS = Object.values(state.source.event_location);
      const filter = LOCATIONS.filter(
        (item) => item.id === Number(locationsFilter)
      );
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setLocationsFilter(null)}>
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
      <div style={{ position: "relative" }}>
        <div className="flex-col" style={{ width: "70%" }}>
          <SearchContainer
            searchFilterRef={searchFilterRef}
            handleSearch={handleSearch}
          />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeSelectedGradesFilter />
          <ServeSelectedLocationFilter />
        </div>
      </div>
    );
  };

  if (!isReady) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
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
  },
};

export default connect(Events);
