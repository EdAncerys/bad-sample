import React, { useEffect } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import { useAppState } from "../context";
import HeroBanner from "../components/heroBanner";
const VideoArchive = ({ state, libraries }) => {
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
  return (
    <BlockWrapper>
      <HeroBanner
        block={{
          background_image:
            "http://3.9.193.188/wp-content/uploads/2022/02/Clinical-Services_Workforce-Planning_Main-Image.jpg",
          title: "BAD Video Library",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam faucibus bibendum ante. Praesent vel fringilla turpis. Etiam lobortis diam dui, sed mollis tellus gravida at. Etiam efficitur mi ut metus maximus, sed accumsan enim sagittis. In ac auctor tellus, quis porttitor velit. Nunc consectetur enim ac tincidunt venenatis. Maecenas vitae sem lobortis, malesuada risus nec, tincidunt metus. Duis tempor, neque vitae malesuada luctus, lorem orci maximus nisl, sagittis interdum orci lectus vel lacus. Nullam aliquam id quam et maximus.",
          content_height: "regular",
          layout: "50-50",
          padding: "small",
          text_align: "left",
          pop_out_text: "true",
        }}
      />
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
