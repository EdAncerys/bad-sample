import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "../../loading";
import { colors } from "../../../config/colors";
import Card from "../../card/card";
import SearchContainer from "../../searchContainer";
import ActionPlaceholder from "../../actionPlaceholder";
import ScrollTop from "../../../components/scrollTop";
import TitleBlock from "../../../components/titleBlock";
import SearchDropDown from "../../../components/searchDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../../blockWrapper";
// CONTEXT -------------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getFadAction,
  muiQuery,
  setFadAction,
  updateProfileAction,
  setErrorAction,
  getAllFadAction,
  getFADSearchAction,
} from "../../../context";

const Directory = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { fad, dashboardPath, isActiveUser, dynamicsApps } = useAppState();

  const postLimit = 20;
  const ctaHeight = 45;

  const [inputValue, setInputValue] = useState("");
  const [searchFilter, setFilter] = useState("");
  const [fadData, setFadData] = useState([]);
  const [searchFadData, setSearchData] = useState(null);
  const [page, setPage] = useState(0);

  const [isSearchFetching, setSearchFetching] = useState(false);
  const [isFetching, setIsFetching] = useState(null);
  const [isGetMore, setGetMore] = useState(null);

  const searchFilterRef = useRef("");
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { sm, md, lg, xl } = muiQuery();

  // DATA pre FETCH ------------------------------------------------------------
  useEffect(async () => {
    try {
      // await getAllFadAction({ state, dispatch });
      if (!fad) {
        // fetch data via API
        const data = await getFadAction({ state, dispatch });
        // set fad data in context of app
        setFadAction({ dispatch, fad: data });
        setFadData(data);
      } else {
        setFadData(fad);
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      searchFilterRef.current = null; // clean up function
    };
  }, []);

  // HANDLERS -------------------------------------------------------------------
  const handlePreferenceUpdate = async () => {
    if (!isActiveUser) return;
    const data = Object.assign(
      {}, // add empty object
      { bad_memberdirectory: !isActiveUser.bad_memberdirectory }
    );
    console.log("data", data); // debug

    try {
      setIsFetching(true);
      // API call to update profile preferences
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
      });
      if (!response) throw new Error("Error updating profile");

      // display error message
      setErrorAction({
        dispatch,
        isError: {
          message: `Members' Directory preferences updated successfully`,
        },
      });
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update members directory preferences. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (isSearchFetching) return;
    if (e.key === "Enter" && searchFilterRef.current.value) {
      handleSearch();
    }
  };

  const handleChange = () => {
    setInputValue(searchFilterRef.current.value);
  };

  const handleClearSearchFilter = () => {
    searchFilterRef.current.value = "";
    setInputValue("");
    setFilter("");

    setSearchData(null); // reset search data
  };

  const handleSearch = async () => {
    const input = searchFilterRef.current.value.toLowerCase();
    if (input.length < 3) return; // data fetch on strings greater than 3

    try {
      setSearchFetching(true);
      const fad = await getFADSearchAction({ state, dispatch, query: input });
      setSearchData(fad);
    } catch (error) {
      console.log(error);
    } finally {
      setInputValue("");
      setFilter(input);
      setSearchFetching(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setGetMore(true);

      const data = await getFadAction({ state, dispatch, page });
      // set fad data in context of app
      setFadAction({ dispatch, fad: data });
      // increment page iteration counter
      setPage(page + 1);
      // set fad data in context of app
      setFadData([...fadData, ...data]);
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to load more members. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setGetMore(false);
    }
  };

  if (dashboardPath !== "Members' Directory") return null; // call after all React hooks
  if (!fadData) return <Loading />; // awaits data

  // SERVERS --------------------------------------------------------
  const ServeFadList = ({ fad }) => {
    return (
      <Card
        fadDirectory={fad}
        colour={colors.primary}
        shadow
        animationType="none"
      />
    );
  };

  const ServeSearchFilter = () => {
    if (!searchFilter) return null;

    return (
      <div className="shadow filter">
        <div>{searchFilter}</div>
        <div className="filter-icon" onClick={handleClearSearchFilter}>
          <CloseIcon />
        </div>
      </div>
    );
  };

  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = inputValue ? closeIcon : searchIcon;

    if (isSearchFetching)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={handleClearSearchFilter}>{icon}</div>;
  };

  const ServeSearchButton = () => {
    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          paddingLeft: !lg ? `2em` : 0,
          paddingTop: !lg ? null : "1em",
        }}
      >
        <button type="submit" className="blue-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (searchFadData) return null; // hide on FAD search
    if (isGetMore) return <Loading />;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          paddingTop: `2em`,
        }}
      >
        <button
          type="submit"
          className="transparent-btn"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </div>
    );
  };

  const ServePreferences = () => {
    if (!isActiveUser) return null;

    // directory agreement field for user
    const { bad_memberdirectory } = isActiveUser;
    // check if user have BAD memberships approved in dynamics apps
    let isBADMember = false;
    if (dynamicsApps) {
      let badApps = dynamicsApps.subs.data.filter((app) => {
        let hasBADMemberships = app.bad_organisedfor === "BAD";

        return hasBADMemberships;
      });
      if (badApps.length) isBADMember = true;
    }
    // dont display action if user is not BAD member
    // console.log("isBADMember", isBADMember); // debug
    if (!isBADMember) return null;

    return (
      <div style={{ position: "relative", margin: `0 ${marginHorizontal}px` }}>
        <ActionPlaceholder
          isFetching={isFetching}
          background="transparent"
          bottom="-30px"
          height="auto"
        />
        <div
          className="blue-btn"
          style={{
            marginRight: "1em",
            width: "fit-content",
            backgroundColor: isActiveUser.bad_memberdirectory
              ? colors.danger
              : colors.white,
          }}
          onClick={handlePreferenceUpdate}
        >
          {bad_memberdirectory ? "Opt-out" : "Opt-in"}
        </div>
      </div>
    );
  };

  const ServeFadMembers = () => {
    if (searchFadData) return null; // hide on FAD search

    return (
      <div>
        <div style={!lg ? styles.container : styles.containerMobile}>
          {fadData.map((fad, key) => {
            return <ServeFadList key={key} fad={fad} />;
          })}
        </div>
        {fadData.length > 15 && <ScrollTop />}
      </div>
    );
  };

  const ServeSearchFadMembers = () => {
    if (!searchFadData) return null; // hide on FAD search

    return (
      <div>
        <div style={!lg ? styles.container : styles.containerMobile}>
          {searchFadData.map((fad, key) => {
            return <ServeFadList key={key} fad={fad} />;
          })}
        </div>
        {searchFadData.length > 15 && <ScrollTop />}
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
        }}
        className="no-selector"
      >
        <BlockWrapper>
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <div
              className="flex-col"
              style={{ padding: "1em 0", width: "75%" }}
            >
              <TitleBlock
                block={{
                  text_align: "left",
                  title: "Members' Directory",
                }}
                margin="1em 0"
              />
              <TitleBlock
                block={{
                  text_align: "left",
                  title:
                    "Search either by name or main place of work to find contact details of colleagues who have opted in to this service",
                }}
                styles={{ fontSize: 16, fontWeight: "normal" }}
                margin="0.5em 0"
              />
              <div className="flex-row">
                <div
                  className="flex"
                  style={{
                    flex: 1,
                    height: ctaHeight,
                    position: "relative",
                    margin: "auto 0",
                  }}
                >
                  <input
                    // id="search-input"
                    ref={searchFilterRef}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    onClick={handleSearch}
                    type="text"
                    className="form-control input"
                    placeholder="Search"
                  />
                  <div
                    className="input-group-text toggle-icon-color"
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
                  </div>
                </div>
                <ServeSearchButton />
              </div>
            </div>
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
      <BlockWrapper>
        <ServePreferences />
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          {isSearchFetching && <Loading />}
          {!isSearchFetching && (
            <div>
              <ServeFadMembers />
              <ServeSearchFadMembers />

              <ServeMoreAction />
            </div>
          )}
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    gap: 20,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(Directory);
