import React, { useState, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import QuickLinksDropDown from "./quickLinksDropDown";
import BlockWrapper from "../blockWrapper";
import SearchDropDown from "../../components/searchDropDown";
import Loading from "../../components/loading";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  appSearchAction,
  setAppSearchDataAction,
  setAppSearchPhraseAction,
  loginAction,
  authenticateAppAction, // TESTING enviroment
  getUserDataByContactId, // TESTING enviroment
} from "../../context";

const HeaderActions = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  const [isReady, SetReady] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isFetching, setFetching] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const searchRef = useRef("");

  const ctaHeight = 45;

  // hook applies after React has performed all DOM mutations
  // prevent dashboard actions to load before isActiveUser data loaded
  useLayoutEffect(() => {
    SetReady(true);
  }, []);

  if (!isReady)
    return (
      <div style={{ height: 178, borderBottom: `1px solid ${colors.primary}` }}>
        <Loading />
      </div>
    );

  // HANDLERS --------------------------------------------
  const handleSearchLookup = async () => {
    const input = searchRef.current.value.toLowerCase();
    setSearchFilter(input);

    // ⬇️ prevent API call if search is less than 3 characters
    if (input && input.length < 3) return;

    try {
      // add 500ms delay on API calls to prevent API throttling
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFetching(true);
      const result = await appSearchAction({ state, query: input });

      if (result && result.length > 0) {
        // ⬇️  set data to match dropdown format
        const data = result.map((item) => {
          const { title, content } = item;
          let titleContent = title;
          if (title && title.rendered) titleContent = title.rendered;
          let bodyContent = content;
          if (content && content.rendered) bodyContent = content.rendered;

          return {
            id: item.id,
            title: titleContent,
            url: item.link,
            type: item.type,
            content: bodyContent,
          };
        });

        setFilter(data);
      } else {
        setFilter(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const redirectHandler = ({ item }) => {
    let path = item.url;
    const wpPath = state.auth.WP_HOST;
    path = path.replace(wpPath, ""); // strip down wp path

    // ⬇️ redirect to url with path ⬇️
    setGoToAction({ state, path, actions });
    clearSearchHandler(); // clear search input
  };

  const clearSearchHandler = () => {
    searchRef.current.value = "";
    setFilter(null);
    setSearchFilter("");
  };

  const takeToSearchHandler = () => {
    // set search data in context state

    setAppSearchDataAction({ dispatch, appSearchData: filter });
    setAppSearchPhraseAction({ dispatch, appSearchPhrase: searchFilter });
    clearSearchHandler(); // clear search input
    // ⬇️ redirect to url with path ⬇️
    setGoToAction({ state, path: "/search/", actions });
  };

  const handleKeyPress = (e) => {
    // dont allow redirect if data is not loaded
    if (isFetching || !filter) return;

    if (e.key === "Enter" && e.target.value) {
      takeToSearchHandler();
    }
  };

  const handleLoginAction = async () => {
    // --------------------------------------------------------------------------------
    // 📌  B2C login action
    // --------------------------------------------------------------------------------

    // ⬇️ development env default login action ⬇️
    if (state.auth.ENVIRONMENT === "DEVELOPMENT-") {
      console.log("🤖 DEVELOPMENT ENVIRONMENT 🤖");

      const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
      await getUserDataByContactId({
        state,
        dispatch,
        jwt,
        // contactid: "cc9a332a-3672-ec11-8943-000d3a43c136", // andy testing account
        // contactid: "84590b32-9490-ec11-b400-000d3a22037e", // mandy
        contactid: "0786df85-618f-ec11-b400-000d3a22037e", // Chris
        // contactid: "969ba377-a398-ec11-b400-000d3aaedef5", // emilia
        refreshJWT,
      });
      return;
    }

    loginAction({ state });
  };

  const mouseLeaveHandler = (e) => {
    // check if mouse is leaving the dropdown based on Y position
    if (e.clientY > ctaHeight * 6) {
      clearSearchHandler();
    }
  };

  // SERVERS ----------------------------------------------------
  const ServeLoginAction = () => {
    if (isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <div className="blue-btn-reverse" onClick={handleLoginAction}>
          Login
        </div>
      </div>
    );
  };

  const ServeDashboardAction = () => {
    if (!isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <button
          onClick={() => setGoToAction({ state, path: `/dashboard/`, actions })}
          className="blue-btn-reverse"
        >
          My Account
        </button>
      </div>
    );
  };

  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = searchFilter ? closeIcon : searchIcon;

    if (isFetching)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={clearSearchHandler}>{icon}</div>;
  };

  return (
    <div style={{ borderBottom: `1px solid ${colors.primary}` }}>
      <BlockWrapper>
        <div className="flex" style={{ padding: `2.75em 0` }}>
          <div className="flex">
            <div
              style={{ width: 385, height: 90, cursor: "pointer" }}
              onClick={() => setGoToAction({ state, path: `/`, actions })}
            >
              <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
            </div>
          </div>

          <div
            className="flex-row"
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              flex: 1.5,
            }}
          >
            <div
              style={{ position: "relative", width: "100%" }}
              onMouseLeave={mouseLeaveHandler}
            >
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
                  ref={searchRef}
                  value={searchFilter}
                  onChange={handleSearchLookup}
                  onKeyPress={(e) => handleKeyPress(e)}
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
              <SearchDropDown
                filter={filter}
                onClickHandler={redirectHandler}
                actionHandler={takeToSearchHandler}
                isAppSearch
              />
            </div>

            <ServeLoginAction />
            <ServeDashboardAction />
            <QuickLinksDropDown />
          </div>
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(HeaderActions);
