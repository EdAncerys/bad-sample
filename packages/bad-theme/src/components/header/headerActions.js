import React, { useState, useLayoutEffect, useRef } from "react";
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

  // --------------------------------------------------------------------------------
  getUserDataByContactId, // TESTING ONLY
  handleRemoveServerSideCookie, // TESTING ONLY
  setAuthenticationCookieAction, // TESTING ONLY
} from "../../context";

const HeaderActions = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [filter, setFilter] = useState(null);
  const [isFetching, setFetching] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const searchRef = useRef("");

  const ctaHeight = 45;
  const SiteLogo = !lg ? BADLogo : MobileLogo;

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
  const ServeDevPanel = () => {
    return null; // kill this for now
    if (state.auth.ENVIRONMENT !== "DEVELOPMENT" || lg) return null;

    return (
      <div
        className="flex"
        style={{
          position: "absolute",
          top: "3em",
          left: "2em",
          justifyContent: "space-between",
          minWidth: 300,
          padding: "1em",
          borderRadius: 10,
          backgroundColor: "rgba(247,61,147,0.5)",
          zIndex: 1,
        }}
      >
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
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() =>
            setAuthenticationCookieAction({
              state,
              b2cTaken:
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE2NTc1MzE3MjcsIm5iZiI6MTY1NzUyODEyNywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9icml0aXNoYWQuYjJjbG9naW4uY29tLzU0MjFmNTA2LTgyMzEtNGY1Ny1hNjBmLTM4MDU1YTk5OGJhZi92Mi4wLyIsInN1YiI6IjU0M2RiNzlhLTAxN2ItNDg4My1iYzU5LWU2ZTllN2UyYmFiOCIsImF1ZCI6ImFkYmVkNzJkLTVlZTAtNDliMS1hMDY0LTQyMWJkYmNkNjhiMiIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNjU3NTI4MTI3LCJhdXRoX3RpbWUiOjE2NTc1MjgxMjcsImdpdmVuX25hbWUiOiJDaHJpcyIsImZhbWlseV9uYW1lIjoiQ3VsbGVuIiwiZXh0ZW5zaW9uX0NvbnRhY3RJZCI6IjA3ODZkZjg1LTYxOGYtZWMxMS1iNDAwLTAwMGQzYTIyMDM3ZSIsImVtYWlscyI6WyJjaHJpc0Bza3lsYXJrY3JlYXRpdmUuY28udWsiXSwidGZwIjoiQjJDXzFfc2lnbnVwc2lnbmluX3VhdCJ9.bwNYYyz3y5ejU_6NBB_x4pyDLlETXbGXQikNuq0AX-LFGBoaU4BteOkzUuBRHtCkh7sQ5ePb5D8sVz1PnzaRg2bTwXFRzi_jl2723OLpdGn-yLpuw2Sihxahj4zfkeePu5KkscaMzcFpFTbry9zlpTsAmAWf-4cZxgTFUIKoQYX4gdjdqSDSSy2ZhSWPzraZPDJOyYOTvIC7yp59Nypb5NyN3Kzqp-eW1wtorDwNWoaWotKzeauRTNZz7RWHzx-zT-BnJmt1V_hpR7-b6vNnO1m7LiOmnSS6rhg9MaTKDAXBbEA0RyY-AB0R7cIq4_iWmJ-HXNdp9cZvmtYb1au2ow",
            })
          }
        >
          B2C JWT
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() =>
            getUserDataByContactId({
              state,
              dispatch,
              contactid: "969ba377-a398-ec11-b400-000d3aaedef5",
            })
          }
        >
          LogIn
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() => handleRemoveServerSideCookie({ state })}
        >
          LogOut
        </div>
      </div>
    );
  };

  const ServeLogInPanel = () => {
    const handleLogin = async ({ lastname }) => {
      console.log("🐞 login trigered");

      const b2cTaken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE2NTc3MTI1ODcsIm5iZiI6MTY1NzcwODk4NywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9icml0aXNoYWQuYjJjbG9naW4uY29tLzU0MjFmNTA2LTgyMzEtNGY1Ny1hNjBmLTM4MDU1YTk5OGJhZi92Mi4wLyIsInN1YiI6IjQzNzMzOWMyLWU1ODctNDVkOS05MWMzLTBkZjVmZWVhZDkzYiIsImF1ZCI6ImFkYmVkNzJkLTVlZTAtNDliMS1hMDY0LTQyMWJkYmNkNjhiMiIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNjU3NzA4OTg3LCJhdXRoX3RpbWUiOjE2NTc3MDg5ODcsImdpdmVuX25hbWUiOiJFbWVsaWEiLCJmYW1pbHlfbmFtZSI6IkdhdGxleSIsImV4dGVuc2lvbl9Db250YWN0SWQiOiI3YjlkMWQzMC1mYWQ1LWVjMTEtYTdiNS0wMDBkM2FiZWQ1MzYiLCJlbWFpbHMiOlsiZW1lbGlhQHNreWxhcmtjcmVhdGl2ZS5jby51ayJdLCJ0ZnAiOiJCMkNfMV9zaWdudXBzaWduaW5fdWF0In0.RCViQq-0bOGsBzXvviNpHaVS21POGP4MHYa6nTgN_DooSziZNc6luhohbMxM-ww_qVKm5HbZ6nIO4aNYEBRKYa6hUQohKzC_SQ5uwoQvVUW7QzfF_2DCh2tdmZV4q9BqVoGwaWBly1NbRx0_cRlVjFtDY2Y4rvkEKuV7z2sYMwzrh5m_2ClaWJJi11EYZ_utEiK_PV0EtY8FKAVO4qUU7E-SvD5oTMmEmYUxw9HrznCobKq9i2R3VzA4o5p_p5QFdOL-uQDtlYU0U6bSLeulPeQHw2NHxgzeor5hSI1TXGEfxO_9jxAiqXlRvQMb_COFP33eKFo-20t66UJ_-joV1A";
      let contactid = "";

      if (lastname === "Brooke")
        contactid = "60a262dc-57f8-e611-80e4-3863bb35cfc8";
      if (lastname === "Bonsall")
        contactid = "05956d48-59f8-e611-80e4-3863bb35cfc8";
      if (lastname === "Bonsall")
        contactid = "0655b9bc-59f8-e611-80e4-3863bb35cfc8";

      try {
        // 📌 set auth cookie for authenticated requests
        await setAuthenticationCookieAction({ state, b2cTaken });
        // 📌 get user data by email
        await getUserDataByContactId({
          state,
          dispatch,
          contactid,
        });
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div
        className="flex"
        style={{
          position: "absolute",
          top: "3em",
          left: "2em",
          justifyContent: "space-between",
          minWidth: 300,
          padding: "1em",
          borderRadius: 10,
          backgroundColor: "rgba(247,61,147,0.5)",
          zIndex: 1,
        }}
      >
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() => handleLogin({ lastname: "Brooke" })}
        >
          Brooke
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() => handleLogin({ lastname: "Bonsall" })}
        >
          Bonsall
        </div>
        <div
          className="blue-btn-reverse"
          style={{ minWidth: "fit-content" }}
          onClick={() => handleLogin({ lastname: "Bulinska" })}
        >
          Bulinska
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
    handleSetCookie({ name: "BAD-cookie-popup", deleteCookie: true });
    console.log("🐞 APP_HOST ", state.auth.APP_HOST);
    console.log("🐞 APP_URL ", state.auth.APP_URL);
    console.log("🐞 ENVIRONMENT ", state.auth.ENVIRONMENT);
    console.log(
      "🐞 DEFAULT_CONTACT_LIST ",
      state.contactList.DEFAULT_CONTACT_LIST
    );
    console.log("🐞 isActiveUser ", isActiveUser);
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

  const ServeTicketNo = () => {
    const ticketNo = state.theme.TICKET_NO;
    const url = state.auth.APP_HOST;
    const isDevelopment =
      state.auth.APP_URL.includes("testing") ||
      state.auth.APP_URL.includes("localhost");

    // 📌 only show for local development & testing url
    if (!isDevelopment) return null;

    return (
      <div
        className="shadow no-selector"
        style={{
          position: "absolute",
          top: "1.5em",
          right: 50,
          padding: 5,
          border: `1px solid ${colors.danger}`,
          fontSize: 10,
          color: colors.danger,
          fontWeight: "bold",
        }}
      >
        Ticket No: {ticketNo}
      </div>
    );
  };

  const ServeInfoBatch = () => {
    // 📌 Production Batch shows if pointing to production server
    const isProduction = !state.auth.APP_HOST.toLowerCase().includes("uat");
    let serverBatch = "UAT";
    if (isProduction) return null;

    return (
      <div style={{ position: "relative" }}>
        <ServeTicketNo />
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
        <ServeInfoBatch />
        <ServeDevPanel />
        <ServeLogInPanel />

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
