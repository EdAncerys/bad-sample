import React from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/colors";

// COMPONENTS ---------------------------------------------------------
import Header from "../components/header/header";
import Footer from "../components/footer";
import LoginModal from "../components/loginModal";
import EnquireModal from "../components/enquireModal";
import CreateAccountModal from "../components/createAccount/createAccountModal";
import Directions from "../components/directions";
import CreateAccount from "./createAccount";
// SCREENS --------------------------------------------------------------
import Post from "./post";
import Page from "./page";
import Login from "./login";
import Home from "./home";
import PilsArchive from "./pilsArchive";
import Pils from "./pils";
import BlocksPage from "../Test/blocksPage";
import Registration from "./registration/registration";
import RegistrationStepOne from "./registration/registrationStepOne";
import RegistrationStepTwo from "./registration/registrationStepTwo";
import RegistrationStepThree from "./registration/registrationStepThree";
import RegistrationStepFour from "./registration/registrationStepFour";
import RegistrationComplete from "./registration/registrationComplete";
import Dashboard from "./dashboard";
import Event from "./event";
// SCREEN HELPERS ---------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { jwt, user } = useAppState();

  const CONTENT_WIDTH = state.theme.contentContainer;

  // env file access
  // console.log(".env variables", state.theme.MY_VARIABLE);

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
      <div style={{ ...styles.container, width: CONTENT_WIDTH }}>
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
            <Dashboard when={endPoint === "/membership/dashboard/"} />
            <Registration when={endPoint === "/membership/register/"} />
            <RegistrationStepOne
              when={endPoint === "/membership/register/step-1-the-process/"}
            />
            <RegistrationStepTwo
              when={
                endPoint === "/membership/register/step-2-personal-information/"
              }
            />
            <RegistrationStepThree
              when={
                endPoint === "/membership/register/step-3-category-selection/"
              }
            />
            <RegistrationStepFour
              when={
                endPoint === "/membership/register/step-4-professional-details/"
              }
            />
            <RegistrationComplete
              when={endPoint === "/membership/register/registration-thank-you/"}
            />

            <PilsArchive when={data.isPilsArchive} />
            <Pils when={data.isPils} />
            <Event when={data.isEvents} />

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
    margin: "0 auto",
  },
};

export default connect(App);
