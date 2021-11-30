import React from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/colors";

import Header from "../components/header/header";
import Post from "./post";
import Page from "./page";
import Login from "./login";
import Home from "./home";
import PilsArchive from "./pilsArchive";
import CreateAccount from "./createAccount";
import LoginModal from "../components/loginModal";
import CreateAccountModal from "../components/createAccount/createAccountModal";
import EnquireModal from "../components/enquireModal";
import Footer from "../components/footer";
import Directions from "../components/directions";
import BlocksPage from "../Test/blocksPage";
// SCREEN HELPERS ---------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const App = ({ state, actions }) => {
  const CONTENT_WIDTH = state.theme.contentContainer;

  // env file access
  // console.log(".env variables", state.theme.myVariable);

  const endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("INDEX data", data); // debug

  return (
    <div
      onClick={() => {
        state.theme.childMenuRef = ""; // reset child menu ref value
        state.theme.activeDropDownRef = "menu reset"; // reset menu ref value
      }}
    >
      <div style={{ ...styles.container, maxWidth: CONTENT_WIDTH }}>
        <Header />
        <Directions />
        <LoginModal />
        <CreateAccountModal />
        <EnquireModal />

        <div className="flex-col">
          <Switch>
            <Loading when={data.isFetching} />
            <Error when={data.isError} />

            <BlocksPage when={data.route.includes("blocks-page")} />
            <Login when={endPoint === "/login/"} />
            <CreateAccount when={endPoint === "/create-account/"} />
            <PilsArchive when={data.isPilsArchive} />

            <Home when={data.isHome} />

            <Post when={data.isPost} />
            <Page when={data.isPage} />
          </Switch>
        </div>
        <Footer />
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver, // content background color
    color: colors.textMain,
    // apply full height to viewport
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    margin: "auto",
  },
};

export default connect(App);
