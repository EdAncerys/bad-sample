import React, { useEffect, useState } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import { useAppState } from "../context";
import HeroBanner from "../components/heroBanner";
const VideoArchive = ({ state, libraries }) => {
  const [heroBannerBlock, setHeroBannerBlock] = useState();
  const { isActiveUser } = useAppState();
  const data = state.source.get(state.router.link);
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // GET VIMEO COVER

  const VideoArchive = ({ post }) => {
    const [vimeoCover, setVimeoCover] = React.useState(
      "http://3.9.193.188/wp-content/uploads/2022/02/VIDEO-LIBRARY.jpg"
    );

    if (post.acf.private && !isActiveUser) return null; // If user isn't logged in, the videos set to private will not show

    const getVimeoCover = async ({ video_url }) => {
      console.log("VIDEOURL", video_url);
      // Example URL: https://player.vimeo.com/video/382577680?h=8f166cf506&color=5b89a3&title=0&byline=0&portrait=0
      const reg = /\d+/g;
      const videoId = video_url.match(reg);
      console.log("VIDELOID", videoId);
      const fetchVideoData = await fetch(
        `http://vimeo.com/api/v2/video/${videoId[0]}.json`
      );
      if (fetchVideoData.ok) {
        const json = await fetchVideoData.json();
        console.log(json[0].thumbnail_medium);
        setVimeoCover(json[0].thumbnail_large);
      }
    };

    useEffect(() => {
      console.log("USEEFFECT");
      getVimeoCover({ video_url: post.acf.video });
    }, []);

    return (
      <Card
        title={post.title.rendered}
        url={vimeoCover}
        body={post.content.rendered}
        publicationDate={post.date}
        videoArchive={post.acf}
      />
    );
  };

  useEffect(() => {
    const fetchHeroBanner = async () => {
      const fetchInfo = await fetch(
        "http://3.9.193.188/wp-json/wp/v2/pages/7051"
      );

      if (fetchInfo.ok) {
        const json = await fetchInfo.json();
        setHeroBannerBlock({
          background_image: json.acf.hero_banner_picture,
          title: "BAD Video Library",
          body: json.acf.hero_banner_content,
          content_height: "regular",
          layout: "50-50",
          padding: "small",
          text_align: "left",
          pop_out_text: "true",
        });
      }
    };
    fetchHeroBanner();
  }, []);
  return (
    <BlockWrapper>
      <HeroBanner block={heroBannerBlock} />
      <div style={styles.container}>
        {data.items.map((item) => {
          const post = state.source[item.type][item.id];
          return <VideoArchive post={post} />;
        })}
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 10,
  },
};
export default connect(VideoArchive);
