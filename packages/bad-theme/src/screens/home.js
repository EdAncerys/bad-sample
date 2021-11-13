import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import { DATA } from "../config/data";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoadingAction } from "../context";
// COMPONENTS ----------------------------------------------------------------
import HomeCarousel from "../components/home/HomeCarousel";
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
import TextBanner from "../components/textBanner";
import PromoBlock from "../components/promoBlock";
import CardList from "../components/cardList";

const home = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppState();
  const data = state.source.get(state.router.link);

  const handleSetLoading = () => {
    setLoadingAction({ dispatch, isLoading: true });
  };

  return (
    <div>
      <div>
        <p style={styles.title}>BAD</p>
      </div>
      {/* <HomeCarousel item={DATA} /> */}
      {/* <PilGuidelines item={DATA} /> */}
      {/* <ButtonsRow item={DATA} /> */}
      {/* <HeroBanner item={DATA} /> */}
      {/* <JournalPromoBlock item={DATA} /> */}
      {/* <MultiPostBlock item={DATA} /> */}
      {/* <FeaturedEvents item={DATA} /> */}
      {/* <Banner item={DATA[0]} /> */}
      {/* <NewsCarousel item={DATA} /> */}
      {/* <Footer /> */}
      {/* <ProfilesBlock item={DATA} /> */}
      {/* <TextBanner item={DATA[2]} alignContent="center" /> */}
      {/* <PromoBlock item={DATA[2]} reverse /> */}
      <CardList item={DATA} />
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(home);
