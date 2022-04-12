import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Switch from "@frontity/components/switch";
import { colors } from "../config/imports";
import { useTransition, animated } from "react-spring";
import AOS from "aos";
// COMPONENTS ---------------------------------------------------------
import Header from "../components/header/header";
import Footer from "../components/footer";
import LoginModal from "../components/loginModal";
import ErrorModal from "../components/errorModal";
import EnquireModal from "../components/enquireModal";
import CreateAccountModal from "../components/createAccount/createAccountModal";
import Breadcrumbs from "../components/breadcrumbs";
import CreateAccount from "./createAccount";
import AnimatedPlaceholder from "../components/animatedPlaceholder";
// SCREENS --------------------------------------------------------------
import Post from "./post";
import Page from "./page";
import Contact from "./contact";
import Login from "./login";
import Home from "./home";
import Codecollect from "./codecollect";
import PilsArchive from "./pilsArchive";
import Pils from "./pils";
import AppSearch from "./appSearch";
import BlocksPage from "../Test/blocksPage";
import RegistrationStepOne from "./registration/registrationStepOne";
import RegistrationStepTwo from "./registration/registrationStepTwo";
import RegistrationStepThree from "./registration/registrationStepThree";
import RegistrationStepFour from "./registration/registrationStepFour";
import RegistrationStepFive from "./registration/registrationStepFive";
import ApplicationChange from "./registration/applicationChange";
import ThankYou from "./registration/thankYouPage";
import AccountDashboard from "./accountDashboard";
import Event from "./event";
import EventsLandingPage from "./eventsLandingPage";
import Venue from "./venue";
import DermGroupsCharity from "./dermGroupsCharity";
import Covid from "./covid";
import PaymentConfirmation from "./paymentConfirmation";
import VideoArchive from "../components/videoArchive";
import VideoGuides from "../components/videoGuides";
import Video from "../components/video";
// SCREEN HELPERS ---------------------------------------------------------
import Error from "./error";
import Loading from "../components/loading";
import BlockWrapper from "../components/blockWrapper";
import { useQuery } from "../hooks/useQuery";
import { useScraper } from "../hooks/useScraper";
import { useB2CLogin } from "../hooks/useB2CLogin";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  authCookieActionAfterCSR,
  getWPMenu,
  setPlaceholderAction,
  setIDFilterAction,
  getLeadershipTeamData,
  muiQuery,
} from "../context";

const App = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser, isPlaceholder, idFilter, refreshJWT } = useAppState();
  const { sm, md, lg, xl, xxl } = muiQuery();

  let urlPath = state.router.link;
  const data = state.source.get(urlPath);
  console.log("INDEX data", data); // debug
  // --------------------------------------------------------------------------------
  // 📌  B2C login handler.
  // --------------------------------------------------------------------------------
  useB2CLogin({ state, actions });
  // 📌 anchor tag scrapper
  useScraper({ urlPath });

  // ⬇️ hook for media queries ⬇️
  useQuery({ state });
  const useEffectRef = useRef(true);

  useEffect(() => {
    // ⬇️ restore scroll history to manual position ⬇️
    window.history.scrollRestoration = "manual";
  }, [urlPath]);

  useEffect(async () => {
    // --------------------------------------------------------------------------------
    // 📌  PRE-FETCH CONTENT DATA HANDLERS
    // --------------------------------------------------------------------------------
    // get current time & save it to variable
    const currentTime = new Date().getTime();
    if (!isPlaceholder) return; // trigger only once
    // ⬇️  get user data if cookie is set
    await authCookieActionAfterCSR({ state, dispatch, refreshJWT });
    // ⬇️  pre-fetch app menu from wp
    await getWPMenu({ state, actions });
    // ⬇️  get leadership data
    await getLeadershipTeamData({ state, actions });
    // get current time & compare how long pre-fetch took before  setting placeholder
    const timeTaken = new Date().getTime() - currentTime;
    // 📌 if time taken is less than 3s await for remaining time before proceeding
    console.log("timeTaken", timeTaken); // debug
    if (timeTaken < 3000) {
      await new Promise((resolve) => setTimeout(resolve, 3000 - timeTaken));
    }
    // ⬇️  set APP placeholder after async actions to false
    // if page path include codecollect, skip placeholder
    if (!urlPath.includes("codecollect"))
      setPlaceholderAction({ dispatch, isPlaceholder: false });
    // animation handler
    AOS.init();
    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  useEffect(() => {
    // ⬇️  clearing id reference
    const slug = "/guidelines-and-standards/clinical-guidelines/";
    if (idFilter && urlPath !== slug)
      setIDFilterAction({ dispatch, idFilter: null }); // reset filter id on page change
  }, [urlPath]);

  const transitions = useTransition(isPlaceholder, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: isPlaceholder,
    delay: 200,
    config: { mass: 1, tension: 280, friction: 120 },
  });

  // ⬇️  handle application animation before data pre fetch
  // show placeholder logo while pre fetch user data is completed
  // RETURN --------------------------------------------------------------------
  return transitions(({ opacity }, appContent) =>
    appContent ? (
      <animated.div className="no-selector">
        <AnimatedPlaceholder opacity={opacity} />
      </animated.div>
    ) : (
      <animated.div
        style={{ opacity: opacity.to({ range: [0.0, 1.0], output: [0.1, 1] }) }}
      >
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
              <ErrorModal />
              <CreateAccountModal />
              <EnquireModal />
            </BlockWrapper>

            <div className="flex-col">
              <Switch>
                <Loading when={data.isFetching} />
                <Error when={data.isError} />
                <BlocksPage when={data.route.includes("blocks")} />

                <Login when={urlPath === "/login/"} />
                <CreateAccount when={urlPath === "/create-account/"} />

                <AccountDashboard
                  when={urlPath === "/dashboard/" && isActiveUser}
                />
                <Contact when={urlPath === "/contact-us/"} />
                <RegistrationStepOne
                  when={urlPath === "/membership/step-1-the-process/"}
                />
                <RegistrationStepTwo
                  when={urlPath === "/membership/step-2-category-selection/"}
                />
                <ApplicationChange
                  when={urlPath === "/membership/application-change/"}
                />
                <RegistrationStepThree
                  when={urlPath === "/membership/step-3-personal-information/"}
                />
                <RegistrationStepFour
                  when={urlPath === "/membership/step-4-professional-details/"}
                />
                <RegistrationStepFive
                  when={urlPath === "/membership/sig-questions/"}
                />
                <ThankYou when={urlPath === "/membership/thank-you/"} />
                <EventsLandingPage when={urlPath === "/events/"} />
                <PilsArchive
                  when={urlPath === "/patient-information-leaflets/"}
                />

                <Codecollect when={urlPath.includes("codecollect")} />
                <Pils when={data.isPils} />
                <AppSearch when={urlPath === "/search/"} />
                <Event when={data.isEvents} />
                <Venue when={data.isVenues} />
                <DermGroupsCharity when={data.isDermGroupsCharity} />
                <Covid when={data.isCovid19} />
                <VideoArchive when={urlPath === "/videos/"} />
                <Home when={data.isHome || urlPath === "/"} />

                <Post when={data.isPost} />
                <Page when={data.isPage} />
                <Video when={data.isVideos} />
              </Switch>
            </div>
            <Footer />
          </div>
        </div>
      </animated.div>
    )
  );
};

const styles = {
  container: {
    backgroundColor: colors.white, // content background color
    color: colors.softBlack,
    // apply full height to viewport
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    minHeight: "100vh",
    minWidth: "100%",
    overflow: "hidden",
  },
};

export default connect(App);
