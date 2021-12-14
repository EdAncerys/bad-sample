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
import Accordion from "../accordion";
import QuotationCarousel from "../quotationCarousel";
import BenefitsGrid from "../benefitsGrid";
import DownloadFileBlock from "../downloadFileBlock";
import Tweets from "../tweets";
import FundingPromo from "../fundingPromo";
import VenueHireGallery from "../venueHireGallery";
import SplitContentAndIndexCard from "../splitContentAndIndexCard";
import NewsArticles from "../newsArticles";
import HistoryTimeline from "../historyTimeline";
import VideoGallery from "../videoGallery";
import SocialIcons from "../socialIcons";
import TitleAndBodyBlock from "../titleAndBodyBlock";
import SplitContentAndUsefulLinksCard from "../splitContentAndUsefulLinksCard";
import MultiPhotoBlock from "../multiPhotoBlock";
import Events from "../events/events";
import GuidelinesAndStandards from "../guidelinesAndStandards";

const BlocksBuilder = ({ state, actions, libraries, blocks, isMenu }) => {
  // console.log("BLOCKS: ", blocks); // debug

  if (!blocks) return null; // if no block content provided

  // SERVERS -----------------------------------------------------
  const ServeBlockTitle = ({ acf_fc_layout }) => {
    return (
      <div
        style={{
          backgroundColor: `#F2DDC1`,
          color: colors.danger,
          textTransform: "uppercase",
        }}
      >
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

          if (acf_fc_layout === "guidelines_and_standards")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <GuidelinesAndStandards key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "events_loop_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Events key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "multiple_photo_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <MultiPhotoBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "split_content_and_useful_links_card_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SplitContentAndUsefulLinksCard key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "title_and_body_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <TitleAndBodyBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "social_icons")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SocialIcons key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "video_gallery_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <VideoGallery key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "history_timeline")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <HistoryTimeline key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "news_article_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <NewsArticles key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "split_content_and_index_card_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SplitContentAndIndexCard key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "venue_hire_gallery")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <VenueHireGallery key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "funding_promo")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <FundingPromo key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "latest_tweets")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Tweets key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "download_file_block")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <DownloadFileBlock key={key} block={block} />
              </div>
            );

          if (acf_fc_layout === "benefits_grid")
            return (
              <div key={key + 1}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <BenefitsGrid key={key} block={block} />
              </div>
            );

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
