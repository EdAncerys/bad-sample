import React from "react";
import { connect } from "frontity";
import Loading from "./loading";
import BlockWrapper from "./blockWrapper";
import Card from "./card/card";
import ShareToSocials from "./card/shareToSocials";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LockIcon from "@mui/icons-material/Lock";
import { useAppState } from "../context";
const Video = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];

  const { isActiveUser } = useAppState();

  if (!post) return loading;
  // STATE
  const [loadVideo, setLoadVideo] = React.useState(false);
  // HELPERS
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  //SERVERS
  const ServeTitle = () => {
    return (
      <div style={{ marginTop: "1em", marginBottom: "1em" }}>
        <h1>{post.title.rendered}</h1>
      </div>
    );
  };
  const ServeContent = () => {
    const ServeImage = () => {
      const [videoCover, setVideoCover] = React.useState(null);
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
          setVideoCover(json[0].thumbnail_large);
        }
      };

      React.useEffect(() => {
        getVimeoCover({ video_url: post.acf.video });
      }, []);
      return (
        <div style={{ position: "relative" }}>
          <Image src={videoCover} alt="Submit" style={{ width: "100%" }} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
            }}
          >
            {post.acf.private && post.acf.price ? (
              <LockIcon sx={{ fontSize: 80 }} className="shadow" />
            ) : (
              <PlayCircleOutlineIcon
                sx={{ fontSize: 80 }}
                onClick={() => setLoadVideo(true)}
                style={{ cursor: "pointer" }}
                className="shadow"
              />
            )}
          </div>
        </div>
      );
    };
    const ServeVideo = () => {
      return (
        <iframe
          src={post.acf.video}
          width="100%"
          height="400"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        />
      );
    };
    const ServeDateAndPrice = () => {
      const ServePrice = () => {
        if (!isActiveUser)
          return (
            <div
              className="primary-title"
              style={{ fontSize: 20, display: "flex", alignItems: "center" }}
            >
              Login to watch or buy
            </div>
          );
        if (post.acf.private && post.acf.price)
          return (
            <div
              type="submit"
              className="blue-btn"
              onClick={() => setLoadVideo(true)}
            >
              Buy for £{post.acf.price}
            </div>
          );
        return (
          <div
            className="primary-title"
            style={{ fontSize: 20, display: "flex", alignItems: "center" }}
          >
            Free To Watch
          </div>
        );
      };
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "1em",
            paddingRight: "1.5em",
            paddingLeft: "1.5em",
          }}
        >
          <ServePrice />
          <p>Published 12.04.2022</p>
        </div>
      );
    };
    return (
      <div className="shadow">
        {loadVideo ? <ServeVideo /> : <ServeImage />}
        <ServeDateAndPrice />
      </div>
    );
  };
  const ServeBody = () => {
    return (
      <Card
        body={post.content.rendered}
        videoArchive={{
          event_specialty: post.event_specialty,
        }}
        colour={colors.orange}
        onClick={() => setGoToAction({ path: post.link, actions })}
        shareToSocials
      />
    );
  };
  const RelatedVideos = () => {
    const videosy = [1, 2];
    return videosy.map((vid) => {
      return (
        <Card
          title="Video Example"
          url="https://i.vimeocdn.com/video/843761302-3d7f394aea80c28b923cee943e3a6be6c0f23410043d41daf399c9a57d19a191-d_640"
          body="Lorem ipsum festilia"
          colour={colors.orange}
          videoArchive={post}
          noVideoCategory
          onClick={() => setGoToAction({ path: post.link, actions })}
        />
      );
    });
  };
  React.useEffect(() => {
    actions.source.fetch("/videos/");
    console.log(window.location.href);
  });
  return (
    <BlockWrapper>
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
        <ServeTitle />
        <div style={styles.container}>
          <div>
            <ServeContent />
            <ServeBody />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
            <div
              className="primary-title"
              style={{ fontSize: 20, padding: "1em" }}
            >
              Related videos
            </div>
            <RelatedVideos />
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
  },
};
export default connect(Video);
