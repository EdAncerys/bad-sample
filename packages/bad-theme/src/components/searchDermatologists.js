import { useState, useEffect, useCallback } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import MapsComponent from "./mapsComponent";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setSearchFilterAction } from "../context";

const SearchDermatologists = ({
  state,
  actions,
  libraries,
  title,
  filterOne,
  disableMargin,
}) => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState(null);

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const TITLE = title || "Search For Dermatologists";

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  useEffect(() => {
    setFilter(null); // handles search filter reset on component load
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleGetCoordinates = () => {
    // if (!filter) return null;

    geocodeByAddress("London")
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        console.log("Successfully got latitude and longitude", { lat, lng })
      );
  };

  const handleSearchSubmit = () => {
    const searchNameInput = document.querySelector("#searchNameInput").value;

    const serveFilterOne = document.querySelector("#serveFilterOne").value;

    const filter = {
      searchNameInput,
      serveFilterOne,
    };
    setFilter(filter);
    handleGetCoordinates();
  };

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    return (
      <div
        className="flex"
        style={{ fontSize: 36, fontWeight: "bold", color: colors.black }}
      >
        {TITLE}
      </div>
    );
  };

  const ServeFilters = () => {
    // if (!filterOne) return null; // props for filter options

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
      // if (!filterOne) return null;

      return (
        <div style={{ paddingRight: `1em` }}>
          <Form.Select
            id="serveFilterOne"
            aria-label="Default select example"
            style={styles.input}
          >
            <option style={styles.option}>Set The Distance</option>
            <option value="1">Category one</option>
            <option value="2">Category Two</option>
            <option value="3">Category Three</option>
            <option value="3">Category Four</option>
          </Form.Select>
        </div>
      );
    };

    return (
      <div className="flex" style={{ padding: `1em 0`, alignItems: "center" }}>
        <ServeTitle />
        <ServeFilterOne />
      </div>
    );
  };

  const ServeSearchContainer = () => {
    const ServeSearchName = () => {
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
              id="searchNameInput"
              type="text"
              className="form-control"
              placeholder="Enter your search..."
              style={styles.input}
            />
            <span
              className="input-group-text"
              style={{
                position: "absolute",
                right: 0,
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

    return (
      <div>
        <div className="flex-row">
          <ServeSearchName />

          <div className="flex">
            <div
              className="flex"
              style={{
                flex: 2,
                marginRight: `2em`,
              }}
            >
              <div style={{ width: "100%" }}>
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyB1HY1FKYgS-Tdiq0uG0J6T-c3_CPed5mo"
                  placeholder="Search"
                  autocompletionRequest={{
                    componentRestrictions: {
                      country: ["uk"],
                    },
                  }}
                  selectProps={{
                    // defaultInputValue: 'Default input value',
                    isClearable: true,
                    onChange: (e) => {
                      console.log(e);
                    },
                  }}
                  style={{ backgroundColor: "pink" }}
                />
              </div>
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
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex"
      style={{
        height: BANNER_HEIGHT / 1.2,
        alignItems: "center",
      }}
    >
      <div className="flex">
        <div
          className="flex-col"
          style={{
            padding: disableMargin
              ? 0
              : `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <ServeTitle />
          {/* <ServeSearchContainer /> */}
          <ServeFilters />
          <MapsComponent />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
  input: {
    borderRadius: 10,
    paddingRight: 60,
    color: colors.darkSilver,
    minWidth: 300,
  },
};

export default connect(SearchDermatologists);
