import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Loading from "./loading";
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
  filterTwo,
  filterThree,
  disableMargin,
}) => {
  const dispatch = useAppDispatch();
  const { filter } = useAppState();

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const TITLE = title || "Search For Dermatologists";

  useEffect(() => {
    console.log("filter", filter);
  }, [filter]);

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector("#searchInput").value;
    const searchNameInput = document.querySelector("#searchNameInput").value;

    const serveFilterOne = document.querySelector("#serveFilterOne").value;

    const filter = {
      searchInput,
      searchNameInput,
      serveFilterOne,
    };
    setSearchFilterAction({ dispatch, filter });
  };

  useEffect(() => {
    setSearchFilterAction({ dispatch, filter: null }); // handles search filter reset on component load
  }, []);

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
          <ServeSearchContainer />
          <ServeFilters />

          <div>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyB1HY1FKYgS-Tdiq0uG0J6T-c3_CPed5mo"
              autocompletionRequest={{
                componentRestrictions: {
                  country: ["uk"],
                },
              }}
              selectProps={{
                // defaultInputValue: 'Default input value',
                isClearable: true,
                onChange: (e) => {
                  // let placeId = "";
                  // if (o) {
                  //   placeId = o["value"]["place_id"];
                  // }
                  // setAddress(o);
                  // formik.setFieldValue("googlePlaceId", placeId);
                  console.log(e);
                },
              }}
            />
          </div>
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
