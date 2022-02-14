import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";

import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
// import MapsComponent from "./maps";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Form } from "react-bootstrap";
import SearchContainer from "../searchContainer";

import BlockWrapper from "../blockWrapper";
import Loading from "../loading";
import { colors } from "../../config/imports";
import { v4 as uuidv4 } from "uuid";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setGoToAction } from "../../context";

const SearchDermatologists = ({ state, actions, libraries, block }) => {
  const dispatch = useAppDispatch();

  const { disable_vertical_padding, background_colour } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const addressFilterRef = useRef(null);
  const nameFilterRef = useRef(null);
  const distanceFilterRef = useRef(null);

  const ctaHeight = 45;

  const [uniqueId, setUniqueId] = useState(null);
  const [isReady, setIsReady] = useState(null);
  const filter = state.theme.addressFilter;

  useEffect(async () => {
    console.log("fetch dermatologists data");

    setIsReady(true);

    return () => {
      addressFilterRef.current = false; // clean up function
    };
  }, []);

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  if (!isReady) return <Loading />; // awaits pre fetch & data

  // HELPERS ----------------------------------------------------------------
  const handleSearchByNameSubmit = () => {
    const input = nameFilterRef.current.value.toLowerCase();

    const distanceFilter = distanceFilter.current.value.toLowerCase();

    const filter = {
      input,
      distanceFilter,
    };
    // setFilter(filter);
  };

  const handleSearch = () => {
    let addressInput = "";
    let nameInput = "";
    let distanceInput = "";

    console.log(
      addressFilterRef.current.value,
      nameFilterRef.current.value,
      distanceFilterRef.current.value
    );
    // if (addressFilterRef.current)
    //   addressInput = addressFilterRef.current.value.toLowerCase();
    // if (nameFilterRef.current)
    //   nameInput = nameFilterRef.current.value.toLowerCase();
    // if (distanceFilterRef.current)
    //   distanceInput = distanceFilterRef.current.value;

    const serachParams = {
      addressInput,
      nameInput,
      distanceInput,
    };

    // state.theme.addressFilter = input;
    console.log("serachParams", serachParams);
  };

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    return (
      <div className="flex primary-title" style={{ fontSize: 36 }}>
        Search For Dermatologists
      </div>
    );
  };

  const ServeFilters = () => {
    // if (!filterOne) return null; // props for filter options

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

    const ServeFilterOne = () => {
      return (
        <div style={{ paddingRight: `1em` }}>
          <Form.Select
            id="serveFilterOne"
            ref={distanceFilter}
            style={{ ...styles.input, minWidth: "100%" }}
          >
            <option value="null" hidden>
              Set The Distance
            </option>
            <option value="1">Category one</option>
            <option value="2">Category Two</option>
            <option value="3">Category Three</option>
            <option value="3">Category Four</option>
          </Form.Select>
        </div>
      );
    };

    return (
      <div className="flex" style={{ alignItems: "center" }}>
        <ServeTitle />
        <ServeFilterOne />
      </div>
    );
  };

  const ServeSearchComponent = () => {
    const ServeSearchName = () => {
      return (
        <div className="flex-row pink" style={{ alignItems: "center" }}>
          <div
            className="flex"
            style={{
              height: ctaHeight,
              position: "relative",
              marginRight: `2em`,
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
              className="input-group-text toggle-icon-color"
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
          <div>
            <button type="submit" className="blue-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeSearchLocation = () => {
      const ServeIcon = () => {
        if (!filter) {
          return <SearchIcon />;
        } else {
          return (
            <div
              className="search-clear-icon"
              style={{ height: ctaHeight }}
              onClick={() => {
                state.theme.addressFilter = null;
                document.querySelector(`#addressSearch${uniqueId}`).value = "";
              }}
            >
              <CloseIcon
                style={{
                  fill: colors.darkSilver,
                  padding: 0,
                }}
              />
            </div>
          );
        }
      };

      const handleAddress = ({ description }) => {
        geocodeByAddress(description)
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) =>
            console.log("Successfully got latitude and longitude", { lat, lng })
          )
          .catch((error) => console.error(error));
      };

      return (
        <div className="flex" style={{ alignItems: "center" }}>
          <div
            className="flex"
            style={{
              height: ctaHeight,
              position: "relative",
              alignItems: "center",
              marginRight: `2em`,
            }}
          >
            <GooglePlacesAutocomplete
              apiKey={`${state.auth.GOOGLE_API_KEY}`}
              debounce={1000} // number of milliseconds to delay before making a call to Google Maps API
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
                    height: ctaHeight,
                    marginRight: 30,
                  }),
                  option: (provided, state) => ({
                    ...provided, // dropdown styles
                    borderBottom: "1px dotted pink",
                    color: "green",
                    cursor: "pointer",
                  }),
                  singleValue: (provided) => ({
                    ...provided, // selected styles
                    color: colors.softBlack,
                    paddingRight: 40,
                  }),
                },
              }}
            />
            <span
              className="input-group-text"
              style={{
                position: "absolute",
                right: 0,
                height: ctaHeight,
                border: "none",
                background: "transparent",
                alignItems: "center",
                color: colors.darkSilver,
                cursor: "pointer",
              }}
            >
              <ServeIcon />
            </span>
          </div>
          <div>
            <button
              type="submit"
              className="blue-btn"
              onClick={handleSearchByNameSubmit}
            >
              Search
            </button>
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: `1em`,
          padding: `2em 0`,
        }}
      >
        <ServeSearchLocation />
        <ServeSearchName />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px 0`,
        backgroundColor: background_colour,
      }}
    >
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
      >
        <BlockWrapper>
          <div
            className="flex-row"
            style={{ padding: `0 ${marginHorizontal}px` }}
          >
            <SearchContainer
              title="Search For Dermatologists"
              addressFilterRef={addressFilterRef}
              handleSearch={handleSearch}
            />

            <SearchContainer
              title="Search By Name"
              addressFilterRef={nameFilterRef}
              handleSearch={handleSearch}
            />
          </div>
        </BlockWrapper>
      </div>
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default connect(SearchDermatologists);
