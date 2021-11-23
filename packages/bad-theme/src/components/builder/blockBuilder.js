import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";

// COMPONENTS ----------------------------------------------------------------
import HomeBannerCarousel from "../home/homeBannerCarousel";
import JournalPromoBlock from "../home/journalPromoBlock";
import ButtonsRow from "../buttonsRow";
import MultiPostBlock from "../multiPostBlock";
import HeroBanner from "../heroBanner";
import TitleBlock from "../titleBlock";
import Banner from "../banner";
import NewsCarousel from "../newsCarousel";
import ProfilesBlock from "../profilesBlock";
import FullWidthContentBlock from "../fullWidthContentBlock";
import PromoBlock from "../promoBlock";
import IndexCard from "../indexCard";
import Accordion from "../accordion";

const BlocksBuilder = ({ state, actions, libraries, blocks, isMenu }) => {
  // console.log("BLOCKS: ", blocks); // debug

  if (!blocks) return null; // if no block content provided

  return (
    <div>
      <div>
        {blocks.map((block, key) => {
          const { acf_fc_layout } = block;
          console.log("CONTENT BLOCK", block); // debug

          if (acf_fc_layout === "promotional_block")
            return <PromoBlock key={key} block={block} />;

          if (acf_fc_layout === "profiles_block")
            return <ProfilesBlock key={key} block={block} />;

          if (acf_fc_layout === "index_card")
            return <IndexCard key={key} block={block} />;

          if (acf_fc_layout === "title_block")
            return <TitleBlock key={key} block={block} />;

          if (acf_fc_layout === "multi_post_block")
            return <MultiPostBlock key={key} block={block} />;

          if (acf_fc_layout === "news_carousel")
            return <NewsCarousel key={key} block={block} isMenu />;

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
    </div>
  );
};

const styles = {
  component: {},
};

export default connect(BlocksBuilder);
