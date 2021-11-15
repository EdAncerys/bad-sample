import React from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/colors";

import Header from "../components/header/header";
import Post from "./post";
import Page from "./page";
import Login from "./login";
import Home from "./home";
import CreateAccount from "./createAccount";
import LoginModal from "../components/loginModal";
import Footer from "../components/footer";
import Directions from "../components/directions";
// SCREEN HELPERS ---------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isLoading, setLogin } = useAppState();

  // env file access
  // console.log(".env variables", state.theme.myVariable);

  const endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("index data----", data); // debug

  return (
    <div className="content-container" style={styles.container}>
      <Header />
      <LoginModal />

      <div className="flex-col">
        <Switch>
          <Directions when={data.isReady} />
          <Loading when={data.isFetching} />
          <Error when={data.isError} />

          <Login when={endPoint === "/login/"} />
          <CreateAccount when={endPoint === "/create-account/"} />
          <Home when={data.isHome} />

          <Post when={data.isPost} />
          <Page when={data.isPage} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
    color: colors.textMain,
    // apply full height to viewport
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
};

export default connect(App);
