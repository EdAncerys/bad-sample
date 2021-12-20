import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { v4 as uuidv4 } from "uuid";

import { colors } from "../../config/colors";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import SearchIcon from "@mui/icons-material/Search";
import QuickLinksDropDown from "./quickLinksDropDown";
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
          marginRight: `2em`,
          padding: `0.75em 0`,
          position: "relative",
        }}
      >
        <input
          id={`searchInput${id}`}
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
      <div>
        <button
          className="btn shadow-none m-2"
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
      <div>
        <button
          className="btn shadow-none m-2"
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
    <div
      className="flex"
      style={{
        alignItems: "center",
        borderBottom: `1px solid ${colors.primary}`,
      }}
    >
      <ServeLogoContainer />
      <div
        className="flex-row"
        style={{
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <ServeSearchContainer />
        <ServeLoginAction />
        <ServeDashboardAction />
        <QuickLinksDropDown />
      </div>
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
};

export default connect(HeaderActions);
