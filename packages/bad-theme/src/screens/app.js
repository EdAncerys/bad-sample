import React from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";

import Header from "../components/header";
import Post from "./post";
import Page from "./page";
import Login from "./login";
import Home from "./home";
import CreateAccount from "./createAccount";
import LoginModal from "../components/loginModal";
// SCREEN HELPERS ---------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isLoading, setLogin } = useAppState();

  const endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("index data----", data); // debug

  return (
    <div>
      <Header />
      <LoginModal />

      <div className="content-container">
        <Switch>
          <Loading when={data.isFetching} />
          <Error when={data.isError} />

          <Login when={endPoint === "/login/"} />
          <CreateAccount when={endPoint === "/create-account/"} />
          <Home when={data.isHome} />

          <Post when={data.isPost} />
          <Page when={data.isPage} />
        </Switch>
      </div>
    </div>
  );
};

export default connect(App);
