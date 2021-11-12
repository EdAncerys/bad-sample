import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
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
      {/* <HomeCarousel /> */}
      {/* <PilGuidelines /> */}
      {/* <ButtonsRow /> */}
      {/* <HeroBanner /> */}
      {/* <JournalPromoBlock /> */}
      {/* <MultiPostBlock /> */}
      {/* <FeaturedEvents /> */}
      {/* <Banner
        title="Title of the banner"
        urlTitle="Find out More"
        url="https://www.skinhealthinfo.org.uk/wp-content/uploads/2019/01/No.58O-1.jpg"
      /> */}
      <NewsCarousel />
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
