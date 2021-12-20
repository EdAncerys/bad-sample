import { useState, useEffect, useCallback } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
// import MapsComponent from "./mapsComponent";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";
const INPUT_WIDTH = 365;

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
  const handleSearchByNameSubmit = () => {
    const searchNameInput = document.querySelector("#searchNameInput").value;

    const serveFilterOne = document.querySelector("#serveFilterOne").value;

    const filter = {
      searchNameInput,
      serveFilterOne,
    };
    setFilter(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    return (
      <div
        className="flex"
        style={{ fontSize: 36, fontFamily: "Roboto", fontWeight: "bold", color: colors.black }}
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
            fontFamily: "Roboto",
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
            style={{ ...styles.input, minWidth: "100%" }}
          >
            <option>Set The Distance</option>
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

  const ServeSearchComponent = () => {
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
              placeholder="Search by Name"
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
              onClick={handleSearchByNameSubmit}
            >
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeSearchLocation = () => {
      const [location, setLocation] = useState(null);

      const handleAddress = ({ description }) => {
        geocodeByAddress(description)
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) =>
            console.log("Successfully got latitude and longitude", { lat, lng })
          )
          .catch((error) => console.error(error));
      };

      return (
        <div className="flex">
          <div
            className="flex"
            style={{
              flex: 2,
              marginRight: `2em`,
            }}
          >
            <div className="flex" style={{ alignItems: "center" }}>
              <div className="flex" style={{ position: "relative" }}>
                <div style={{ width: INPUT_WIDTH }}>
                  <GooglePlacesAutocomplete
                    apiKey={`${state.theme.GOOGLE_API_KEY}`}
                    debounce={1000} // number of milliseconds to delay before making a call to Google Maps API
                    placeholder="Search"
                    autocompletionRequest={{
                      componentRestrictions: {
                        country: ["uk"],
                      },
                    }}
                    onLoadFailed={
                      (error) =>
                        console.error("Could not inject Google script", error) // to be called when the injection of the Google Maps JavaScript API fails due to network error
                    }
                    textInputProps={{
                      leftIcon: { type: "font-awesome", name: "chevron-left" },
                      errorStyle: { color: "red" },
                    }}
                    selectProps={{
                      // defaultInputValue: "Default input value",
                      placeholder: "Search by location/postcode",
                      isClearable: true,
                      onChange: (e) => {
                        if (!e) return null;

                        console.log(e);
                        handleAddress({ description: e.label });
                      },

                      styles: {
                        input: (provided) => ({
                          ...provided,
                          color: colors.darkSilver,
                          overflow: "hidden",
                          borderColor: colors.primary,
                          marginRight: 30,
                        }),
                        option: (provided, state) => ({
                          ...provided, // dropdown styles
                          borderBottom: "1px dotted pink",
                          color: "green",
                        }),
                        singleValue: (provided) => ({
                          ...provided, // selected styles
                          color: colors.textMain,
                          paddingRight: 40,
                        }),
                      },
                    }}
                  />
                </div>
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
              onClick={handleSearchByNameSubmit}
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
          <ServeSearchLocation />
          <ServeSearchName />
        </div>
      </div>
    );
  };

  const ServeMap = () => {
    return (
      <div className="flex pink" style={{ margin: `2em 0` }}>
        <MapsComponent />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex-col"
      style={{
        padding: disableMargin
          ? 0
          : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <ServeTitle />
      <ServeSearchComponent />
      <ServeFilters />
      {/* <ServeMap /> */}
    </div>
  );
};

const styles = {
  container: {},
  input: {
    borderRadius: 10,
    paddingRight: 60,
    color: colors.darkSilver,
    minWidth: INPUT_WIDTH,
  },
};

export default connect(SearchDermatologists);
