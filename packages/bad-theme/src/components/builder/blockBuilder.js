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
import QuotationCarousel from "../quotationCarousel";

const BlocksBuilder = ({ state, actions, libraries, blocks, isMenu }) => {
  // console.log("BLOCKS: ", blocks); // debug

  if (!blocks) return null; // if no block content provided

  // SERVERS -----------------------------------------------------
  const ServeBlockTitle = ({ acf_fc_layout }) => {
    return (
      <div style={{ color: colors.danger, textTransform: "uppercase" }}>
        {acf_fc_layout}
      </div>
    );
  };

  return (
    <div>
      <div>
        {blocks.map((block, key) => {
          const { acf_fc_layout } = block;
          console.log("CONTENT BLOCK", block); // debug

          if (acf_fc_layout === "quotation_carousel")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <QuotationCarousel key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "promotional_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <PromoBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "profiles_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <ProfilesBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "index_card")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <IndexCard key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "title_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <TitleBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "multi_post_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <MultiPostBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "news_carousel")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <NewsCarousel key={key} block={block} isMenu />
              </div>
            );

          if (acf_fc_layout === "banner")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Banner key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "buttons_row")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <ButtonsRow key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "accordion")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Accordion key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "journal_promo_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <JournalPromoBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "full_width_content_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <FullWidthContentBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "home_banner_carousel")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <HomeBannerCarousel key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "hero_banner")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <HeroBanner key={key} block={block} />
              </div>
            );

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
