import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoadingAction } from "../../context";
// COMPONENTS ----------------------------------------------------------------
import HomeCarousel from "../../components/home/HomeCarousel";
import PilGuidelines from "../../components/home/pilGuidelines";
import JournalPromoBlock from "../../components/home/journalPromoBlock";
import ButtonsRow from "../../components/buttonsRow";
import MultiPostBlock from "../../components/multiPostBlock";
import HeroBanner from "../../components/heroBanner";
import FeaturedEvents from "../../components/featuredEvents";
import Banner from "../../components/banner";
import NewsCarousel from "../../components/newsCarousel";
import Footer from "../../components/footer";
import ProfilesBlock from "../../components/profilesBlock";
import TextBanner from "../../components/textBanner";
import PromoBlock from "../../components/promoBlock";
import CardList from "../../components/cardList";
import Accordion from "../../components/accordion";

const Home = ({ state, actions, libraries, blocks }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppState();
  // console.log("BLOCKS: ", blocks); // debug

  const Html2React = libraries.html2react.Components; // to render html contentment
  // <Html2React html={rendered} /> // get html content from state

  const handleSetLoading = () => {
    setLoadingAction({ dispatch, isLoading: true });
  };

  return (
    <div>
      <div>
        <p style={styles.title}>BLOCK BUILDER 😈 </p>
      </div>
      <div>
        {blocks.map((block, key) => {
          const { acf_fc_layout } = block;

          // if (acf_fc_layout === "hero_banner") console.log(block);
          if (acf_fc_layout === "hero_banner")
            return <HeroBanner key={key} block={block} />;

          return null;
        })}
      </div>
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
