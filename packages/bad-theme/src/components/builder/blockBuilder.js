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
import Accordion from "../accordion/accordion";
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
import ElectionBlocks from "../elections/electionBlocks";
import EmbeddedVideo from "../embeddedVideo";
import NewsAndMedia from "../news/newsAndMedia";
import FullWidthImageAndPromoCard from "../fullWidthImageAndPromoCard";
import ImageBlock from "../imageBlock";
import PilGuidelineSearch from "../pilGuidelineSearch";
import SearchDermatologists from "../maps/searchDermatologists";
import DividerBlock from "../dividerBlock";
import CPTBlock from "../cptBlock";
import RSSFeed from "../rssFeed";
import FundingBlock from "../fundingBlock";
import BADMemberships from "../badMemberships";
import VideoGuides from "../videoGuides";
import FindADermatologist from "../findADermatologist";
import VideoArchive from "../videoArchive";
const BlocksBuilder = ({ state, actions, libraries, blocks, isMenu }) => {
  // console.log("BLOCKS: ", blocks); // debug

  if (!blocks) return null; // if no block content provided

  // SERVERS -----------------------------------------------------
  const ServeBlockTitle = ({ acf_fc_layout }) => {
    if (state.auth.ENVIRONMENT !== "DEVELOPMENT") return null; // add block name title

    return (
      <BlockWrapper>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              zIndex: 99,
              top: 0,
              left: 0,
              backgroundColor: `rgb(248, 239, 243, 0.8)`,
              color: colors.danger,
              textTransform: "uppercase",
              textAlign: "center",
              width: "100%",
            }}
          >
            {acf_fc_layout}
          </div>
        </div>
      </BlockWrapper>
    );
  };

  return (
    <div>
      {blocks.map((block, key) => {
        const { acf_fc_layout } = block;
        console.log("CONTENT BLOCK", block); // debug

        if (acf_fc_layout === "video_guide_block")
          return (
            <div key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <VideoGuides key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "membership_accordion")
          return (
            <BlockWrapper key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <BADMemberships key={key} block={block} />
            </BlockWrapper>
          );

        if (acf_fc_layout === "funding_loop_block")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <FundingBlock key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "bjd_feed")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <RSSFeed key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "ced_feed")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <RSSFeed key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "shd_feed")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <RSSFeed key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "covid_loop_block")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <CPTBlock key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "dermatology_group_and_charity")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <CPTBlock key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "divider_block")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <DividerBlock key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "search_dermatologists")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <SearchDermatologists key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "guideline_search_block")
          return (
            <BlockWrapper key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <PilGuidelineSearch key={key} block={block} />
            </BlockWrapper>
          );

        if (acf_fc_layout === "image_block")
          return (
            <BlockWrapper key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <ImageBlock key={key} block={block} />
            </BlockWrapper>
          );

        if (acf_fc_layout === "full_width_image_and_promo_card")
          return (
            <BlockWrapper key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <FullWidthImageAndPromoCard key={key} block={block} />
            </BlockWrapper>
          );

        if (acf_fc_layout === "news_and_media_loop_block")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <NewsAndMedia key={key} block={block} />
            </div>
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
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <GuidelinesAndStandards key={key} block={block} />
            </div>
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

        if (acf_fc_layout === "video_archive")
          return (
            <BlockWrapper key={key + 1} background={block.background_colour}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <VideoArchive key={key} block={block} />
            </BlockWrapper>
          );

        if (acf_fc_layout === "home_banner_carousel")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <HomeBannerCarousel key={key} block={block} />
            </div>
          );

        if (acf_fc_layout === "find_a_dermatologist_block")
          return (
            <div key={key + 1}>
              <ServeBlockTitle acf_fc_layout={acf_fc_layout} />
              <FindADermatologist key={key} block={block} />
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
  );
};

export default connect(BlocksBuilder);
