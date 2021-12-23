import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { v4 as uuidv4 } from "uuid";

import { colors } from "../../config/colors";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import SearchIcon from "@mui/icons-material/Search";
import QuickLinksDropDown from "./quickLinksDropDown";
import BlockWrapper from "../blockWrapper";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setGoToAction,
} from "../../context";

const HeaderActions = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppState();

  const id = uuidv4();

  // SERVERS ----------------------------------------------------
  const ServeLogoContainer = () => {
    return (
      <div className="flex">
        <div
          style={{ width: 385, height: 90, cursor: "pointer" }}
          onClick={() => setGoToAction({ path: `/`, actions })}
        >
          <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
        </div>
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div
        className="flex"
        style={{
          flex: 1,
          padding: `0.75em 0`,
          position: "relative",
        }}
      >
        <input
          // id={`searchMain${id}`}
          type="text"
          className="form-control"
          placeholder="Find An Event"
          style={styles.input}
        />
        <span
          className="input-group-text"
          style={{
            position: "absolute",
            right: 0,
            height: 40,
            border: "none",
            background: "transparent",
            alignItems: "center",
            color: colors.darkSilver,
          }}
        >
          <SearchIcon />
        </span>
      </div>
    );
  };

  const ServeLoginAction = () => {
    if (user) return null;

    return (
      <div style={styles.actionBtn}>
        <button
          className="btn shadow-none"
          onClick={() =>
            setLoginModalAction({ dispatch, loginModalAction: true })
          }
          style={styles.loginBtn}
        >
          Login
        </button>
      </div>
    );
  };

  const ServeDashboardAction = () => {
    if (!user) return null;

    return (
      <div style={styles.actionBtn}>
        <button
          className="btn shadow-none"
          onClick={() =>
            setGoToAction({
              path: `https://badadmin.skylarkdev.co/membership`,
              actions,
            })
          }
          style={styles.loginBtn}
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
              flex: 1.5,
            }}
          >
            <ServeSearchContainer />
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
  loginBtn: {
    fontSize: 16,
    color: colors.white,
    backgroundColor: colors.primary,
    textTransform: "capitalize",
    border: "none",
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
  actionBtn: { padding: `0 2em` },
};

export default connect(HeaderActions);
