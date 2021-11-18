import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import { DATA } from "../config/data";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoadingAction } from "../context";
// COMPONENTS ----------------------------------------------------------------
import HomeBannerCarousel from "../components/home/homeBannerCarousel";
import PilGuidelines from "../components/home/pilGuidelines";
import JournalPromoBlock from "../components/home/journalPromoBlock";
import ButtonsRow from "../components/buttonsRow";
import MultiPostBlock from "../components/multiPostBlock";
import HeroBanner from "../components/heroBanner";
import FeaturedEvents from "../components/featuredEvents";
import Banner from "../components/banner";
import NewsCarousel from "../components/newsCarousel";
import Footer from "../components/footer";
import ProfilesBlock from "../components/profilesBlock";
import FullWidthContentBlock from "../components/fullWidthContentBlock";
import PromoBlock from "../components/promoBlock";
import IndexCard from "../components/indexCard";
import Accordion from "../components/accordion";
import CardFS from "../components/cardFs";

const Home = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppState();

  const Html2React = libraries.html2react.Components; // to render html contentment
  // <Html2React html={rendered} /> // get html content from state

  const data = state.source.get(state.router.link);
  const home = state.source[data.type];
  console.log("home data: ", home); // debug

  const handleSetLoading = () => {
    setLoadingAction({ dispatch, isLoading: true });
  };

  return (
    <div>
      <div>
        <p style={styles.title}>BAD Home</p>
      </div>
      {/* <HomeBannerCarousel item={DATA} /> */}
      {/* <PilGuidelines item={DATA} /> */}
      {/* <ButtonsRow item={DATA} /> */}
      {/* <HeroBanner item={DATA} /> */}
      {/* <JournalPromoBlock item={DATA} /> */}
      {/* <MultiPostBlock item={DATA} /> */}
      {/* <FeaturedEvents item={DATA} /> */}
      {/* <Banner item={DATA[0]} /> */}
      {/* <NewsCarousel item={DATA} /> */}
      {/* <Footer /> */}
      <ProfilesBlock item={DATA} />
      {/* <FullWidthContentBlock item={DATA[2]} alignContent="center" /> */}
      <PromoBlock item={DATA[2]} reverse />
      <IndexCard item={DATA} />
      {/* <Accordion item={DATA} /> */}
      <CardFS
        title={`${DATA.title}`}
        body={`${DATA.body}`}
        url={`${DATA.imgUrl}`}
      />
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(Home);
