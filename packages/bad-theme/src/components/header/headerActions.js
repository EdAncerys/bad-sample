import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import BADLogo from "../../img/svg/badLogoHeader.svg";
import SearchIcon from "@mui/icons-material/Search";
import QuickLinksDropDown from "./quickLinksDropDown";

const HeaderActions = ({ state, actions }) => {
  const isLoggedIn = state.context.isLoggedIn;
  console.log("isLoggedIn", isLoggedIn);

  // HELPERS ----------------------------------------------------
  const handleGoToLink = ({ path }) => {
    actions.router.set(path);
  };

  const handleLoginAction = () => {
    actions.context.setActionFlipper;
    console.log("hello", state.theme.GOOGLE_API_KEY);
  };

  // SERVERS ----------------------------------------------------
  const ServeLogoContainer = () => {
    return (
      <div className="flex">
        <div
          style={{ width: 385, height: 90, cursor: "pointer" }}
          onClick={() => handleGoToLink({ path: "/" })}
        >
          <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
        </div>
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
      <div className="flex d-none d-lg-block">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your search..."
          />
          <span className="input-group-text" id="basic-addon2">
            <SearchIcon />
          </span>
        </div>
      </div>
    );
  };

  const ServeLoginAction = () => {
    if (isLoggedIn) return null;

    return (
      <div>
        <button
          className="btn shadow-none m-2"
          onClick={handleLoginAction}
          style={styles.loginBtn}
        >
          Login
        </button>
      </div>
    );
  };

  const ServeDashboardAction = () => {
    if (!isLoggedIn) return null;

    return (
      <div>
        <button
          className="btn shadow-none m-2"
          onClick={() => handleGoToLink({ path: "/dashboard" })}
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
};

export default connect(HeaderActions);
