import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import EventLoopBlock from "./eventLoopBlock";
import SearchContainer from "../searchContainer";
import Loading from "../loading";
import { colors } from "../../config/imports";

import date from "date-and-time";
const DATE_MODULE = date;

import CloseIcon from "@mui/icons-material/Close";
// CONTEXT --------------------------------------------------------
import { getEventsData } from "../../helpers";

import { muiQuery } from "../../context";

const Events = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();
  // console.log("EVENTS BLOCK: ", block);

  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [specialty, setSpecialty] = useState(null); // data

  const [searchFilter, setSearchFilter] = useState("");
  const [gradesFilter, setGradesFilter] = useState("");
  const [locationsFilter, setLocationsFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const searchFilterRef = useRef("");

  const isSearch = block.add_search_function;

  useEffect(async () => {
    // pre fetch events data
    let iteration = 0;
    let data = state.source.events;

    while (!data) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getEventsData({ state, actions });
      data = state.source.post;
      iteration++;
    }

    let grades = null;
    let locations = null;
    let specialty = null;
    if (state.source.event_grade)
      grades = Object.values(state.source.event_grade);
    if (state.source.event_location)
      locations = Object.values(state.source.event_location);
    if (state.source.event_specialty)
      specialty = Object.values(state.source.event_specialty);

    setGrades(grades);
    setLocations(locations);
    setSpecialty(specialty);

    return () => {
      searchFilterRef.current = ""; // clean up function
    };
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();

    if (!!input) setSearchFilter(input);
  };

  // SERVERS ---------------------------------------------
  const ServeFilters = () => {
    const ServeTitle = () => {
      return (
        <div
          className="primary-title"
          style={{ fontSize: 20, paddingRight: !lg ? `2em` : 0 }}
        >
          Filter:
        </div>
      );
    };

    const ServeGradeFilter = () => {
      if (!grades) return null;

      return (
        <div
          className="flex"
          style={{ paddingRight: !lg ? `1em` : 0, width: "100%" }}
        >
          <Form.Select
            style={styles.input}
            value={gradesFilter}
            onChange={(e) => setGradesFilter(e.target.value)}
          >
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
        <div
          className="flex"
          style={{ paddingRight: !lg ? `1em` : 0, width: "100%" }}
        >
          <Form.Select
            style={styles.input}
            value={locationsFilter}
            onChange={(e) => setLocationsFilter(e.target.value)}
          >
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

    const ServeSpecialtyFilter = () => {
      if (!specialty) return null;

      return (
        <div className="flex" style={{ paddingRight: `1em` }}>
          <Form.Select
            style={styles.input}
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="" hidden>
              Event Topic
            </option>
            {specialty.map((item, key) => {
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

    const ServeYearFilter = () => {
      // get current month
      const currentMonth = new Date().getMonth();
      // get array of next 12 months and a year based on current month
      const monthsFeature = [...Array(12).keys()].map((item, key) => {
        let month = currentMonth + key + 1;
        let year = new Date().getFullYear();
        if (month > 12) {
          year++;
          month = month - 12;
        }
        return `${month} 1 ${year}`;
      });

      // get array of past 12 months and a year based on current month
      const monthsPast = [...Array(12).keys()].map((item, key) => {
        let month = currentMonth - key;
        let year = new Date().getFullYear();
        if (month < 1) {
          year--;
          month = month + 12;
        }
        return `${month} 1 ${year}`;
      });

      let eventSearchMonth = monthsFeature;
      if (block.events_archive) eventSearchMonth = monthsPast;

      return (
        <div className="flex">
          <Form.Select
            style={styles.input}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="" hidden>
              Filter By Month
            </option>
            {eventSearchMonth.map((time, key) => {
              const dateObject = new Date(time);
              const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

              return (
                <option key={key} value={time}>
                  {formattedDate}
                </option>
              );
            })}
          </Form.Select>
        </div>
      );
    };

    return (
      <div
        className={!lg ? "flex" : "flex-col"}
        style={{ padding: `1em 0`, alignItems: !lg ? "center" : "flex-start" }}
      >
        <ServeTitle />
        <ServeGradeFilter />
        <ServeLocationFilter />
        <ServeSpecialtyFilter />
        <ServeYearFilter />
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
          <div className="filter-icon" onClick={() => setSearchFilter("")}>
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
      const grades = Object.values(state.source.event_grade);
      const filter = grades.filter((item) => item.id === Number(gradesFilter));
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setGradesFilter("")}>
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
      const locations = Object.values(state.source.event_location);
      const filter = locations.filter(
        (item) => item.id === Number(locationsFilter)
      );
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setLocationsFilter("")}>
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

    const ServeSpecialtyFilter = () => {
      if (!specialtyFilter) return null;

      const specialty = Object.values(state.source.event_specialty);
      const filter = specialty.filter(
        (item) => item.id === Number(specialtyFilter)
      );
      let name = "Specialty";
      if (filter[0]) name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setSpecialtyFilter("")}>
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

    const ServeSelectedYearFilter = () => {
      if (!yearFilter) return null;
      // get current date
      const dateObject = new Date(yearFilter);
      const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

      return (
        <div className="shadow filter">
          <div>{formattedDate}</div>
          <div className="filter-icon" onClick={() => setYearFilter("")}>
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
        <div className="flex-col" style={{ width: !lg ? "70%" : "100%" }}>
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
          <ServeSpecialtyFilter />
          <ServeSelectedYearFilter />
        </div>
      </div>
    );
  };

  if (!grades || !locations) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <ServeFilter />
      <EventLoopBlock
        block={block}
        searchFilter={searchFilter}
        gradesFilter={gradesFilter}
        locationsFilter={locationsFilter}
        yearFilter={yearFilter}
        specialtyFilter={specialtyFilter}
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
