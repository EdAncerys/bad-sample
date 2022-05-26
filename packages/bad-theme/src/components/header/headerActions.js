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
import PersonIcon from "@mui/icons-material/Person";

// Responsive
import MobileLogo from "../../img/png/logo-mobile.png";
import Login from "@mui/icons-material/Login";
import ResponsiveMenuIcon from "../../img/png/BAD-Mobile_MENU.png";
import MobileMenu from "./MobileMenu";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  appSearchAction,
  setAppSearchDataAction,
  setAppSearchPhraseAction,
  muiQuery,
  setCreateAccountModalAction,
  getUserDataByContactId, // TESTING enviroment
  fetchDataHandler, // TESTING enviroment
  handleSetCookie, // TESTING enviroment
  handleGetCookie, // TESTING enviroment
  handleRemoveServerSideCookie, // TESTING enviroment
} from "../../context";

const HeaderActions = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [isReady, SetReady] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isFetching, setFetching] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const searchRef = useRef("");

  const ctaHeight = 45;
  const SiteLogo = !lg ? BADLogo : MobileLogo;
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
    // delay search lookup to prevent multiple requests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ⬇️ prevent API call if search is less than 3 characters
    if (input && input.length < 3) return;

    try {
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
      // console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const redirectHandler = ({ item }) => {
    let path = item.url;
    const wpPath = state.auth.WP_HOST;
    path = path.replace(wpPath, "/"); // strip down wp path
    // ⬇️ if path have // replace with /
    path = path.replace(/\/\//g, "/");

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

  // 🚀 🚀 🚀  TESTING 🚀 🚀 🚀
  const ServeTesting = () => {
    if (state.auth.ENVIRONMENT !== "DEVELOPMENT") return null;

    return (
      <div className="flex" style={{ padding: `0 1em` }}>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={handleCheck}
        >
          ST
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={handleCookie}
        >
          🍪
        </div>
      </div>
    );
  };

  const handleCheck = async () => {
    let path = state.auth.APP_HOST + "/utils/cookie";
    const response = await fetchDataHandler({
      path,
      state,
    });
    let data = "not found";
    if (response && response.ok) {
      data = await response.json();
      console.log("🐞 Auth level ", data.data.level);
      console.log("🐞 data ", data.data);
    }
  };

  const handleCookie = async () => {
    handleSetCookie({ name: "no-cookie", deleteCookie: true }); // to show list of all cookies
    console.log("🐞 APP_HOST ", state.auth.APP_HOST);
    console.log("🐞 APP_URL ", state.auth.APP_URL);
    console.log("🐞 ENVIRONMENT ", state.auth.ENVIRONMENT);
    console.log(
      "🐞 DEFAULT_CONTACT_LIST ",
      state.contactList.DEFAULT_CONTACT_LIST
    );
  };
  // 🚀 🚀 🚀  TESTING 🚀 🚀 🚀

  const handleLoginAction = async () => {
    // --------------------------------------------------------------------------------
    // 📌  B2C login action
    // --------------------------------------------------------------------------------

    setCreateAccountModalAction({
      dispatch,
      createAccountAction: true,
    });
  };

  const mouseLeaveHandler = (e) => {
    // check if mouse is leaving the dropdown based on Y position
    if (e.clientY > ctaHeight * 6) {
      clearSearchHandler();
    }
  };

  // SERVERS ----------------------------------------------------
  const ServeProductionBatch = () => {
    // 📌 Production Batch shows if pointing to production server
    const isProduction = !state.auth.APP_HOST.toLowerCase().includes("uat");
    let serverBatch = "UAT";
    if (isProduction) return null;

    return (
      <div style={{ position: "relative" }}>
        <div
          className="shadow no-selector"
          style={{
            position: "absolute",
            top: "1.5em",
            right: 0,
            padding: isProduction ? "5px 1px" : 5,
            borderRadius: "50%",
            border: `1px solid ${colors.danger}`,
            fontSize: 10,
            color: colors.danger,
            fontWeight: "bold",
          }}
        >
          {serverBatch}
        </div>
      </div>
    );
  };

  const ServeLoginAction = () => {
    if (isActiveUser) return null;

    if (!lg)
      return (
        <div style={{ padding: `0 1em` }}>
          <div className="blue-btn-reverse" onClick={handleLoginAction}>
            Login
          </div>
        </div>
      );

    return <Login />;
  };

  const ServeMobileMenuAction = () => {
    return (
      <div style={{}}>
        <div onClick={() => setMobileMenuActive(!mobileMenuActive)}>
          <Image src={ResponsiveMenuIcon} style={{ maxWidth: "65px" }} />
        </div>
      </div>
    );
  };

  const ServeDashboardAction = () => {
    if (!isActiveUser) return null;

    if (!lg)
      return (
        <div style={{ padding: `0 1em` }}>
          <div
            onClick={() =>
              setGoToAction({ state, path: `/dashboard/`, actions })
            }
            className="blue-btn-reverse"
          >
            My Account
          </div>
        </div>
      );

    return (
      <div style={{ padding: `0 1em` }}>
        <div
          onClick={() => setGoToAction({ state, path: `/dashboard/`, actions })}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PersonIcon />
          Dashboard
        </div>
      </div>
    );
  };

  const ServeMobileLoginAction = () => {
    if (isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <div
          onClick={handleLoginAction}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Login />
          Login
        </div>
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
      {mobileMenuActive && <MobileMenu />}
      <BlockWrapper>
        <ServeProductionBatch />
        <div className="flex" style={{ padding: !lg ? `2.75em 0` : `0.3em 0` }}>
          <div className="flex">
            <div
              style={{
                width: !lg ? 385 : 60,
                height: !lg ? 90 : 60,
                marginLeft: !lg ? null : "1em",
                cursor: "pointer",
              }}
              onClick={() => setGoToAction({ state, path: `/`, actions })}
            >
              <Image src={SiteLogo} className="d-block h-100" alt="BAD Logo" />
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
            {!lg && (
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
            )}

            {!lg ? <ServeLoginAction /> : <ServeMobileLoginAction />}
            <ServeDashboardAction />
            {!lg ? <QuickLinksDropDown /> : null}
            {!lg ? null : <ServeMobileMenuAction />}
            <ServeTesting />
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
