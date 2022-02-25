import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/imports";

// COMPONENTS ---------------------------------------------------------
import Header from "../components/header/header";
import Footer from "../components/footer";
import LoginModal from "../components/loginModal";
import EnquireModal from "../components/enquireModal";
import CreateAccountModal from "../components/createAccount/createAccountModal";
import Breadcrumbs from "../components/breadcrumbs";
import CreateAccount from "./createAccount";
// SCREENS --------------------------------------------------------------
import Post from "./post";
import Page from "./page";
import Contact from "./contact";
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
import RegistrationStepFive from "./registration/registrationStepFive";
import RegistrationComplete from "./registration/registrationComplete";
import AccountDashboard from "./accountDashboard";
import Event from "./event";
import EventsLandingPage from "./eventsLandingPage";
import Venue from "./venue";
import DermGroupsCharity from "./dermGroupsCharity";
import Covid from "./covid";
// SCREEN HELPERS ---------------------------------------------------------
import Error from "./error";
import Loading from "../components/loading";
import BlockWrapper from "../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, anchorScrapper } from "../context";
import { useCookies } from "react-cookie";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  let endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("INDEX data", data); // debug

  useEffect(() => {
    // ⬇️ anchor tag scrapper
    anchorScrapper();
  }, [endPoint]);

  // RETURN ------------------------------------------------------------
  return (
    <div
      onClick={(e) => {
        state.theme.childMenuRef = ""; // reset child menu ref value
        state.theme.activeDropDownRef = "menu reset"; // reset menu ref value
      }}
    >
      <div style={{ ...styles.container }}>
        <Header />
        <Breadcrumbs />
        <BlockWrapper>
          <LoginModal />
          <CreateAccountModal />
          <EnquireModal />
        </BlockWrapper>

        <div className="flex-col">
          <Switch>
            <Loading when={data.isFetching} />
            <Error when={data.isError} />
            <BlocksPage when={data.route.includes("blocks")} />

            <Login when={endPoint === "/login/"} />
            <CreateAccount when={endPoint === "/create-account/"} />

            <AccountDashboard
              when={endPoint === "/dashboard/" && isActiveUser}
            />
            <Contact when={endPoint === "/contact-us/"} />
            <RegistrationStepOne
              when={endPoint === "/membership/step-1-the-process/"}
            />
            <RegistrationStepTwo
              when={endPoint === "/membership/step-2-category-selection/"}
            />
            <RegistrationStepThree
              when={endPoint === "/membership/step-3-personal-information/"}
            />
            <RegistrationStepFour
              when={endPoint === "/membership/step-4-professional-details/"}
            />
            <RegistrationStepFive
              when={endPoint === "/membership/step-5-sig-questions/"}
            />
            <RegistrationComplete
              when={endPoint === "/membership/final-step-thank-you/"}
            />
            <EventsLandingPage when={endPoint === "/events/"} />
            <PilsArchive when={endPoint === "/patient-information-leaflets/"} />

            <Pils when={data.isPils} />
            <Event when={data.isEvents} />
            <Venue when={data.isVenues} />
            <DermGroupsCharity when={data.isDermGroupsCharity} />
            <Covid when={data.isCovid19} />

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
