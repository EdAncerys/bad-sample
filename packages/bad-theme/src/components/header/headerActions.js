import React, { useState, useMemo, useLayoutEffect, useRef } from "react";
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
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setGoToAction,
  appSearchAction,
} from "../../context";

const HeaderActions = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [isReady, SetReady] = useState(null);
  const [filter, setFilter] = useState(null);
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

    try {
      const result = await appSearchAction({ query: input });
      console.log(result);

      // ⬇️ set data search with request
      if (result.length > 0) {
        // set data to match dropdown format
        const data = result.map((item) => {
          return {
            id: item.id,
            title: item.title.rendered,
            url: item.link,
            type: item.type,
          };
        });

        // set data to state
        setFilter(data);
      } else {
        setFilter(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redirectHandler = ({ item }) => {
    console.log(item);
    let path = item.url;
    const wpPath = "http://3.9.193.188";

    path = path.replace(wpPath, ""); // strip down wp path
    // ⬇️ redirect to url with path ⬇️
    setGoToAction({ path, actions });
  };

  // SERVERS ----------------------------------------------------
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

  const ServeDashboardAction = () => {
    if (!isActiveUser) return null;

    return (
      <div style={{ padding: `0 1em` }}>
        <button
          onClick={() =>
            setGoToAction({
              path: `/dashboard/`,
              actions,
            })
          }
          className="blue-btn"
        >
          My Account
        </button>
      </div>
    );
  };

  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = filter ? closeIcon : searchIcon;

    return (
      <div
        onClick={() => {
          setValue(null);
          searchRef.current.value = "";
          setFilter(null);
        }}
      >
        {icon}
      </div>
    );
  };

  return (
    <div style={{ borderBottom: `1px solid ${colors.primary}` }}>
      <BlockWrapper>
        <div className="flex" style={{ padding: `2.75em 0` }}>
          <div className="flex">
            <div
              style={{ width: 385, height: 90, cursor: "pointer" }}
              onClick={() => setGoToAction({ path: `/`, actions })}
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
            <div style={{ position: "relative", width: "100%" }}>
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
                  onChange={handleSearchLookup}
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
