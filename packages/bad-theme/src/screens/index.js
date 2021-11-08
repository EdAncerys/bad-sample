// File: /packages/my-first-theme/src/components/index.js

import React from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";

import Header from "../components/header";
import Post from "./post";
import Page from "./page";
import Login from "./login";
import Home from "./home";
import CreateAccount from "./createAccount";
// HELPERS ----------------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";

const Root = ({ state, actions }) => {
  const endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("index data ", data); // debug

  return (
    <div>
      <Header />

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

export default connect(Root);
