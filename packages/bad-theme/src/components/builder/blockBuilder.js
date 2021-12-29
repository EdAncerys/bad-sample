import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/imports";

// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../blockWrapper";

// COMPONENTS ----------------------------------------------------------------
import HomeBannerCarousel from "../home/homeBannerCarousel";
import JournalPromoBlock from "../home/journalPromoBlock";
import ButtonsRow from "../buttonsRow";
import MultiPostBlock from "../multiPostBlocks/multiPostBlocks";
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
import Events from "../events/events";
import GuidelinesAndStandards from "../guidelinesAndStandards";
import LeadershipBlock from "../leadershipBlock";
import ElectionBlocks from "../electionBlocks";
import EmbeddedVideo from "../embeddedVideo";
import NewsAndMedia from "../news/newsAndMedia";
import FullWidthImageAndPromoCard from "../fullWidthImageAndPromoCard";

const BlocksBuilder = ({ state, actions, libraries, blocks, isMenu }) => {
  // console.log("BLOCKS: ", blocks); // debug

  if (!blocks) return null; // if no block content provided

  // SERVERS -----------------------------------------------------
  const ServeBlockTitle = ({ acf_fc_layout }) => {
    if (state.theme.ENVIRONMENT !== "DEVELOPMENT") return null; // add block name title

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

          if (acf_fc_layout === "full_width_image_and_promo_card")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <FullWidthImageAndPromoCard key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "news_and_media_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <NewsAndMedia key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "embedded_video_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <EmbeddedVideo key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "elections_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <ElectionBlocks key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "leadership_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <LeadershipBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "guidelines_and_standards_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <GuidelinesAndStandards key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "events_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Events key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "split_content_and_useful_links_card_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SplitContentAndUsefulLinksCard key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "title_and_body_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <TitleAndBodyBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "social_icons")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SocialIcons key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "video_gallery_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <VideoGallery key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "history_timeline")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <HistoryTimeline key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "news_article_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <NewsArticles key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "split_content_and_index_card_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <SplitContentAndIndexCard key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "venues_loop_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <VenueHireGallery key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "funding_promo")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <FundingPromo key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "latest_tweets")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Tweets key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "download_file_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <DownloadFileBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "benefits_grid")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <BenefitsGrid key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "quotation_carousel")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <QuotationCarousel key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "promotional_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <PromoBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "profiles_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <ProfilesBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "title_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <TitleBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "multi_post_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <MultiPostBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "news_carousel")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <NewsCarousel key={key} block={block} isMenu />
              </BlockWrapper>
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
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <ButtonsRow key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "accordion")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <Accordion key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "journal_promo_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <JournalPromoBlock key={key} block={block} />
              </BlockWrapper>
            );

          if (acf_fc_layout === "full_width_content_block")
            return (
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <FullWidthContentBlock key={key} block={block} />
              </BlockWrapper>
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
              <BlockWrapper key={key + 1} background={block.background_colour}>
                <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
                <HeroBanner key={key} block={block} />
              </BlockWrapper>
            );

          return null;
        })}
      </div>
    </div>
  );
};

export default connect(BlocksBuilder);
