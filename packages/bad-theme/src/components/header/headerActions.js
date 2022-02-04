import React, { useState, useMemo, useLayoutEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import QuickLinksDropDown from "./quickLinksDropDown";
import BlockWrapper from "../blockWrapper";
import SearchInput from "./searchInput";
import Loading from "../../components/loading";
import { muiQuery } from "../../context";

// RESPONSIVE ----------------------------------------------
import MobileLogo from "../../img/png/logo-mobile.png";
import SearchIcon from "@mui/icons-material/Search";
import Login from "@mui/icons-material/Login";
import ResponsiveMenuIcon from "../../img/png/BAD-Mobile_MENU.png";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setGoToAction,
} from "../../context";
import Search from "@mui/icons-material/Search";

const HeaderActions = ({ state, actions }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const isDevelopment = state.auth.ENVIRONMENT;

  const [isReady, SetReady] = useState(null);

  // hook applies after React has performed all DOM mutations
  // prevent dashboard actions to load before isActiveUser data loaded
  useLayoutEffect(() => {
    SetReady(true);
  }, []);
  if (!isReady)
    return (
      <div
        style={{
          height: !lg ? 178 : 40,
          borderBottom: `1px solid ${colors.primary}`,
        }}
      >
        <Loading />
      </div>
    );

  // SERVERS ----------------------------------------------------
  const ServeLogoContainer = () => {
    return (
      <div className="flex">
        <div
          style={{ width: 385, height: 90, cursor: "pointer" }}
          onClick={() =>
            setGoToAction({ path: `https://badadmin.skylarkdev.co/`, actions })
          }
        >
          {useMemo(() => (
            <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
          ))}
        </div>
      </div>
    );
  };

  const ServeMobileLogoContainer = () => {
    return (
      <div className="flex">
        <div
          style={{ width: "5em", aspectRatio: "1/1", cursor: "pointer" }}
          onClick={() =>
            setGoToAction({ path: `https://badadmin.skylarkdev.co/`, actions })
          }
        >
          {useMemo(() => (
            <Image src={MobileLogo} className="d-block h-100" alt="BAD Logo" />
          ))}
        </div>
      </div>
    );
  };
  const ServeLoginAction = () => {
    if (isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <div
          className="blue-btn"
          onClick={() =>
            setLoginModalAction({ dispatch, loginModalAction: true })
          }
        >
          Login
        </div>
      </div>
    );
  };

  const ServeMobileLoginAction = () => {
    if (isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <div
          onClick={() =>
            setLoginModalAction({ dispatch, loginModalAction: true })
          }
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

  const ServeMobileSearchAction = () => {
    return (
      <div style={{}}>
        <div
          onClick={() =>
            setLoginModalAction({ dispatch, loginModalAction: true })
          }
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SearchIcon />
          Search
        </div>
      </div>
    );
  };

  const ServeMobileMenuAction = () => {
    return (
      <div style={{}}>
        <div
          onClick={() =>
            setLoginModalAction({ dispatch, loginModalAction: true })
          }
        >
          <Image src={ResponsiveMenuIcon} style={{ maxWidth: "80px" }} />
        </div>
      </div>
    );
  };
  const ServeDashboardAction = () => {
    if (!isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <button
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/dashboard`,
              actions,
            })
          }
          className="blue-btn"
        >
          Dashboard
        </button>
      </div>
    );
  };

  const ServeMobileDashboardAction = () => {
    if (!isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <button
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/dashboard`,
              actions,
            })
          }
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            border: 0,
          }}
        >
          <AccountBoxIcon />
          Dashboard
        </button>
      </div>
    );
  };

  return (
    <div style={{ borderBottom: `1px solid ${colors.primary}` }}>
      <BlockWrapper>
        <div className="flex" style={{ padding: !lg ? `2.75em 0` : "0.3em" }}>
          {!lg ? <ServeLogoContainer /> : <ServeMobileLogoContainer />}

          <div
            className="flex-row"
            style={{
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {!lg ? <SearchInput /> : <ServeMobileSearchAction />}
            {!lg ? <ServeLoginAction /> : <ServeMobileLoginAction />}
            {!lg ? <ServeDashboardAction /> : <ServeMobileDashboardAction />}
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
