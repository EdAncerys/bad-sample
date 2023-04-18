import React, { useState, useEffect, useRef } from "react";
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
import {
  muiQuery,
  getEventGrades,
  getEventLocations,
  getEventSpecialties,
} from "../../context";
// import SearchBar from "../searchBar";

const Events = ({ state, block, disableMargin }) => {
  const { lg } = muiQuery();

  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [specialty, setSpecialty] = useState(null); // data

  const [searchFilter, setSearchFilter] = useState("");
  const [gradesFilter, setGradesFilter] = useState("");
  const [locationsFilter, setLocationsFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  let marginHorizontal = state.theme.marginHorizontal;
  if (disableMargin) marginHorizontal = 0;

  const searchFilterRef = useRef("");
  const isSearch = block.add_search_function;

  useEffect(async () => {
    // pre fetch events data
    let grades = await getEventGrades({ state });
    let locations = await getEventLocations({ state });
    let specialtys = await getEventSpecialties({ state });

    setGrades(grades);
    setLocations(locations);
    setSpecialty(specialtys);
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();

    if (input) setSearchFilter(input);
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
      // sort grades alphabetically by name
      // const sortedGrades = grades.sort((a, b) => {
      //   return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      // });
      // custom sort grades by name in order based on array of grades
      const sortedGradesCustom = grades.sort((a, b) => {
        const order = [
          "All Levels",
          "Consultants",
          "Dermatology Trainees",
          "GPs",
          "SAS Doctors",
          "CESR Candidates",
          "Allied Healthcare Professionals",
          "Medical Students",
        ];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

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
            {sortedGradesCustom.map((item, key) => {
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
      // sort locations alphabetically & if name includes online then move to top
      const sortedLocations = locations.sort((a, b) => {
        if (a.name.toLowerCase().includes("online")) return -1;
        if (b.name.toLowerCase().includes("online")) return 1;
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });

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
            {sortedLocations.map((item, key) => {
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
      // sort locations alphabetically
      const sortedSpecialty = specialty.sort((a, b) => {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });

      return (
        <div
          className="flex"
          style={{ paddingRight: !lg ? `1em` : 0, width: !lg ? null : "100%" }}
        >
          <Form.Select
            style={styles.input}
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="" hidden>
              Event Topic
            </option>
            {sortedSpecialty.map((item, key) => {
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

    const ServeMonthFilter = () => {
      // get current month
      const currentMonth = new Date().getMonth(); // 👉 current month number representation (1-12)
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
        <div
          className="flex"
          style={{ paddingRight: !lg ? `1em` : 0, width: !lg ? null : "100%" }}
        >
          <Form.Select
            style={!lg ? styles.input : styles.mobileInput}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
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

    const ServeYearFilter = () => {
      const currentYear = new Date().getFullYear();

      const getYearsArray = (startIndex, increment, length) =>
        [...Array(length).keys()].map((_, index) => {
          const year = startIndex + index * increment;
          return `${year}`;
        });

      let eventSearchYear = [];

      if (block.events_archive) {
        // if block is set to archive mode, show past 5 years including the current year
        eventSearchYear = getYearsArray(currentYear, -1, 6).reverse();
      } else {
        // if block is set to future mode, show next 5 years including the current year
        eventSearchYear = getYearsArray(currentYear, 1, 6);
      }

      return (
        <div className="flex" style={{ width: "100%" }}>
          <Form.Select
            style={!lg ? styles.input : styles.mobileInput}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="" hidden>
              Filter By Year
            </option>
            {eventSearchYear.map((year, key) => {
              const dateObject = new Date(year);
              const formattedDate = DATE_MODULE.format(dateObject, "YYYY");

              return (
                <option key={key} value={year}>
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
        style={{
          padding: `1em 0`,
          alignItems: !lg ? "center" : "flex-start",
          gap: !lg ? null : 10,
        }}
      >
        <ServeTitle />
        <ServeGradeFilter />
        <ServeLocationFilter />
        <ServeSpecialtyFilter />
        <ServeMonthFilter />
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

    const ServeSelectedMonthFilter = () => {
      if (!monthFilter) return null;
      // get current date
      const dateObject = new Date(monthFilter);
      const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

      return (
        <div className="shadow filter">
          <div>{formattedDate}</div>
          <div className="filter-icon" onClick={() => setMonthFilter("")}>
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
      const formattedDate = DATE_MODULE.format(dateObject, "YYYY");

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
          <ServeSelectedMonthFilter />
          <ServeSelectedYearFilter />
        </div>
      </div>
    );
  };

  if (!grades || !locations || !specialty) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <ServeFilter />
      <EventLoopBlock
        block={block}
        searchFilter={searchFilter}
        gradesFilter={gradesFilter}
        locationsFilter={locationsFilter}
        monthFilter={monthFilter}
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
  mobileInput: {
    borderRadius: 10,
    width: "100%",
    paddingRight: 0,
  },
};

export default connect(Events);
