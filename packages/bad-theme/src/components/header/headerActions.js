import React, { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import QuickLinksDropDown from "./quickLinksDropDown";
import BlockWrapper from "../blockWrapper";
import SearchInput from "./searchInput";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setGoToAction,
} from "../../context";

const HeaderActions = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { jwt } = useAppState();

  const user = state.context.isActiveUser;
  const isDevelopment = state.auth.ENVIRONMENT;

  const [isReady, SetReady] = useState(null);

  // hook applies after React has performed all DOM mutations
  // prevent dashboard actions to load before user data loaded
  useLayoutEffect(() => {
    SetReady(true);
  }, []);
  if (!isReady) return <div style={{ height: 178,  borderBottom: `1px solid ${colors.primary}` }} />;

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
          <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
        </div>
      </div>
    );
  };

  const ServeLoginAction = () => {
    if (user) return null;

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

  const ServeDashboardAction = () => {
    if (!user) return null;

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

  return (
    <div style={{ borderBottom: `1px solid ${colors.primary}` }}>
      <BlockWrapper>
        <div className="flex" style={{ padding: `2.75em 0` }}>
          <ServeLogoContainer />
          <div
            className="flex-row"
            style={{
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <SearchInput />
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
