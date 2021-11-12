import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
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
      {/* <HomeBannerCarousel /> */}
      {/* <PilGuidelines /> */}
      {/* <ButtonsRow /> */}
      {/* <HeroBanner /> */}
      <JournalPromoBlock />
      {/* <MultiPostBlock /> */}
      <FeaturedEvents />
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
