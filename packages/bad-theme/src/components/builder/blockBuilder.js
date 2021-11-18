import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoadingAction } from "../../context";
// COMPONENTS ----------------------------------------------------------------
import HomeBannerCarousel from "../home/homeBannerCarousel";
import PilGuidelines from "../../components/home/pilGuidelines";
import JournalPromoBlock from "../../components/home/journalPromoBlock";
import ButtonsRow from "../../components/buttonsRow";
import MultiPostBlock from "../../components/multiPostBlock";
import HeroBanner from "../../components/heroBanner";
import HeaderBlock from "../headerBlock";
import Banner from "../../components/banner";
import NewsCarousel from "../../components/newsCarousel";
import ProfilesBlock from "../../components/profilesBlock";
import FullWidthContentBlock from "../fullWidthContentBlock";
import PromoBlock from "../../components/promoBlock";
import IndexCard from "../indexCard";
import Accordion from "../../components/accordion";

const Home = ({ state, actions, libraries, blocks }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppState();
  // console.log("BLOCKS: ", blocks); // debug

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  // <Html2React html={rendered} /> // get html content from state

  // HANDLERS --------------------------------------------------------
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
          console.log("CONTENT BLOCK", block); // debug

          // if (acf_fc_layout === "journal_promo_block")
          //   console.log("CONTENT BLOCK", block);

          if (acf_fc_layout === "index_card")
            return <IndexCard key={key} block={block} />;

          if (acf_fc_layout === "header_block")
            return <HeaderBlock key={key} block={block} />;

          if (acf_fc_layout === "multi_post_block")
            return <MultiPostBlock key={key} block={block} />;

          if (acf_fc_layout === "news_carousel")
            return <NewsCarousel key={key} block={block} />;

          if (acf_fc_layout === "banner")
            return <Banner key={key} block={block} />;

          if (acf_fc_layout === "buttons_row")
            return <ButtonsRow key={key} block={block} />;

          if (acf_fc_layout === "accordion")
            return <Accordion key={key} block={block} />;

          if (acf_fc_layout === "journal_promo_block")
            return <JournalPromoBlock key={key} block={block} />;

          if (acf_fc_layout === "full_width_content_block")
            return <FullWidthContentBlock key={key} block={block} />;

          if (acf_fc_layout === "home_banner_carousel")
            return <HomeBannerCarousel key={key} block={block} />;

          if (acf_fc_layout === "hero_banner")
            return <HeroBanner key={key} block={block} />;

          return null;
        })}
      </div>
      <div>
        <p style={styles.title}>STATIC COMPONENTS</p>
      </div>
      <PilGuidelines />
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
