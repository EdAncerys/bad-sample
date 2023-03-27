import React, { useState, useRef, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import QuickLinksDropDown from "./quickLinksDropDown";
import BlockWrapper from "../blockWrapper";
import SearchDropDown from "../../components/searchDropDown";

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
  handleSetCookie,
  fetchDataHandler,
  loginAction,
} from "../../context";
import { getBADMembershipSubscriptionData } from "../../helpers/inputHelpers";

const HeaderActions = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, applicationData } = useAppState();

  const [filter, setFilter] = useState(null);
  const [customActions, setCustomActions] = useState(); // 👈 header custom actions. CPT to get actions for header btn component
  const [isFetching, setFetching] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const searchRef = useRef("");

  const ctaHeight = 45;
  const SiteLogo = !lg ? BADLogo : MobileLogo;

  useEffect(() => {
    (async () => {
      try {
        // ⬇️ prefetch custom actions CPT
        const response = await fetch(
          state.auth.WP_HOST +
            "/wp-json/wp/v2/header_actions?_fields=id,slug,type,link,title,content,acf"
        );
        const data = await response.json();

        setCustomActions(data);
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

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

  const appDataHandler = async () => {
    const data = await getBADMembershipSubscriptionData({
      state,
      category: "BAD", // SIG or BAD
      type: "Trainee", // Junior or Senior
    });
  };

  const handleApiRequest = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic ZGVtbzphc2RmZ2g=");

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const res = await fetch(
        "https://badmainstagstg.wpengine.com/wp-json/wp/v2/memberships?_fields=id,date,slug,title,sog_groupe,acf",
        requestOptions
      );
      const data = await res.json();
    } catch (error) {
      // console.log(error);
    }
  };

  // 🚀 🚀 🚀  TESTING 🚀 🚀 🚀

  const DevPanel = () => {
    if (state.auth.ENVIRONMENT !== "DEV" || lg) return null; // kill if not in dev mode

    return (
      <div
        className="flex"
        style={{
          position: "absolute",
          top: "3em",
          left: "2em",
          justifyContent: "space-between",
          padding: "1em",
          borderRadius: 10,
          backgroundColor: "rgba(247,61,147,0.5)",
          zIndex: 1,
          gap: 10,
        }}
      >
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={handleAboutInfo}
        >
          i
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={appDataHandler}
        >
          host
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={handleApiRequest}
        >
          API req
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
    }
  };

  const handleAboutInfo = async () => {
    handleSetCookie({ name: "BAD-cookie-popup", deleteCookie: true });
  };
  // 🚀 🚀 🚀  TESTING 🚀 🚀 🚀

  const handleLoginAction = async () => {
    // --------------------------------------------------------------------------------
    // 📌  B2C login action
    // --------------------------------------------------------------------------------
    loginAction({ state });

    // --------------------------------------------------------------------------------
    // 📌  Partial modal login action (not used)
    // --------------------------------------------------------------------------------
    // setCreateAccountModalAction({
    //   dispatch,
    //   createAccountAction: true,
    // });
  };

  const mouseLeaveHandler = (e) => {
    // check if mouse is leaving the dropdown based on Y position
    if (e.clientY > ctaHeight * 6) {
      clearSearchHandler();
    }
  };

  // SERVERS ----------------------------------------------------
  const ServeInfoBatch = () => {
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
          <div
            className="blue-btn-reverse"
            // 👇 testing purposes attribute
            data-type="login"
            onClick={handleLoginAction}
          >
            Login
          </div>
        </div>
      );

    return <Login />;
  };

  const CustomActions = () => {
    const acf = customActions?.[0]?.acf || {};
    const { published, label, link } = acf;

    if (!published) {
      return null;
    }

    const displayLabel =
      label?.length > 30 ? `${label.slice(0, 30)}...` : label;
    const handleClick = () => (window.location.href = link);

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50px",
          left: "16px",
          width: "315px",
        }}
      >
        <div className="transparent-btn" onClick={handleClick}>
          {displayLabel}
        </div>
      </div>
    );
  };

  const ServeMobileMenuAction = () => {
    return (
      <div style={{ cursor: "pointer" }}>
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
            // 👇 testing purposes attribute
            data-type="my-account"
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
          // 👇 testing purposes attribute
          data-type="login"
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
      <DevPanel />

      {mobileMenuActive && (
        <MobileMenu setMobileMenuActive={setMobileMenuActive} />
      )}
      <BlockWrapper>
        <ServeInfoBatch />

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

            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                {!lg ? <ServeLoginAction /> : <ServeMobileLoginAction />}
                <ServeDashboardAction />
                {!lg ? <QuickLinksDropDown /> : null}
              </div>
              {!lg && <CustomActions />}
            </div>
            {!lg ? null : <ServeMobileMenuAction />}
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
