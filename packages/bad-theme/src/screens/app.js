import { useState, useEffect } from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/imports";

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
import AccountDashboard from "./accountDashboard";
import Event from "./event";
import EventsLandingPage from "./eventsLandingPage";
import Venue from "./venue";
// SCREEN HELPERS ---------------------------------------------------------
import Loading from "../components/loading";
import Error from "./error";
import BlockWrapper from "../components/blockWrapper";
import { handleGetCookie } from "../helpers/cookie";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";
import { useCookies } from "react-cookie";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { jwt } = useAppState();
  const user = state.context.isActiveUser;

  const endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("INDEX data", data); // debug

  // HELPERS ------------------------------------------------------------
  // const LOGIN_COOKIE = "BAD-WebApp";
  // const [cookies, setCookie] = useCookies();
  // console.log("cookies", cookies);
  // useEffect(() => {
  //   if (cookies) {
  //     console.log(`API call ${cookies}`);
  //   }
  // }, []);

  // RETURN ------------------------------------------------------------
  return (
    <div
      onClick={(e) => {
        state.theme.childMenuRef = ""; // reset child menu ref value
        state.theme.activeDropDownRef = "menu reset"; // reset menu ref value
        state.theme.filter = null; // reset search event filter
        state.theme.pilFilter = null; // reset pil filter
      }}
    >
      <div style={{ ...styles.container }}>
        <Header />
        <Directions />
        <BlockWrapper>
          <LoginModal />
          <CreateAccountModal />
          <EnquireModal />
        </BlockWrapper>

        <div className="flex-col">
          <Switch>
            <Loading when={data.isFetching} />
            <Error when={data.isError} />
            <BlocksPage when={data.route.includes("blocks-page")} />

            <Login when={endPoint === "/login/"} />
            <CreateAccount when={endPoint === "/create-account/"} />

            <AccountDashboard when={endPoint === "/dashboard/" && user} />
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
            <EventsLandingPage when={endPoint === "/events/"} />

            <PilsArchive when={data.isPilsArchive} />
            <Pils when={data.isPils} />
            <Event when={data.isEvents} />
            <Venue when={data.isVenues} />

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
    backgroundColor: colors.white, // content background color
    color: colors.softBlack,
    // apply full height to viewport
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    margin: "0 auto",
  },
};

export default connect(App);
