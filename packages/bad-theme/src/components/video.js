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
import {
  useAppState,
  useAppDispatch,
  authenticateAppAction,
  setEnquireAction,
} from "../context";
import { handleGetCookie } from "../helpers/cookie";
import PaymentModal from "./dashboard/paymentModal";
const Video = ({ state, actions, libraries }) => {
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { isActiveUser } = useAppState();
  const dispatch = useAppDispatch();
  console.log(isActiveUser);
  if (!post) return <Loading />;

  console.log(post);
  // STATE
  const [loadVideo, setLoadVideo] = React.useState(false);
  const [videoStatus, setVideoStatus] = React.useState("");
  const [paymentUrl, setPaymentUrl] = React.useState("");
  // HELPERS
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  //HELPERS
  const handlePayment = async () => {
    const cookie = handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;

    const the_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000/"
        : state.auth.APP_URL;

    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        "/sagepay/test/video/" +
        contactid +
        "/" +
        post.acf.event_id +
        "/" +
        post.acf.price +
        `?redirecturl=${the_url}/payment-confirmation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      const url =
        json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
      setPaymentUrl(url);
    }
    // setPage({ page: "directDebit", data: block });
  };
  const resetPaymentUrl = () => {
    setPaymentUrl(null);
  };
  //SERVERS
  const ServeTitle = () => {
    return (
      <div style={{ marginTop: "1em", marginBottom: "1em" }}>
        <h1>
          <Html2React html={post.title.rendered} />
        </h1>
      </div>
    );
  };
  const ServeContent = () => {
    const ServeImage = () => {
      const [videoCover, setVideoCover] = React.useState(
        "https://badadmin.skylarkdev.co/wp-content/uploads/2022/02/VIDEO-LIBRARY.jpg"
      );
      const getVimeoCover = async ({ video_url }) => {
        console.log("VIDEOURL", video_url);
        // Example URL: https://player.vimeo.com/video/382577680?h=8f166cf506&color=5b89a3&title=0&byline=0&portrait=0
        const reg = /\d+/g;
        const videoId = video_url.match(reg);
        console.log("VIDELOID", videoId);
        const fetchVideoData = await fetch(
          `https://vimeo.com/api/v2/video/${videoId[0]}.json`
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
            {!videoStatus || videoStatus === "locked" ? (
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
        if (!videoStatus || !isActiveUser)
          return (
            <div>
              <div
                className="primary-title"
                style={{ fontSize: 20, display: "flex", alignItems: "center" }}
              >
                {post.acf.private ? "Login to watch or buy" : "Free to watch"}
              </div>
              {post.acf.private && `£${post.acf.price}`}
            </div>
          );
        if (isActiveUser && post.acf.private && videoStatus === "locked")
          return (
            <div
              type="submit"
              className="blue-btn"
              onClick={() => handlePayment()}
            >
              Buy for £{post.acf.price}
            </div>
          );
        if (post.acf.private && videoStatus === "unlocked")
          return (
            <div
              className="primary-title"
              style={{ fontSize: 20, display: "flex", alignItems: "center" }}
            >
              You own the video
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
        disableCardAnimation
      />
    );
  };
  const RelatedVideos = () => {
    const videos_list = Object.values(state.source.videos);
    const related_videos_to_show = videos_list.slice(0, 2);
    return related_videos_to_show.map((vid) => {
      if (vid.id === post.id) vid = videos_list[2];
      return (
        <Card
          title={vid.title.rendered}
          url="https://i.vimeocdn.com/video/843761302-3d7f394aea80c28b923cee943e3a6be6c0f23410043d41daf399c9a57d19a191-d_640"
          body={vid.content.rendered}
          colour={colors.orange}
          videoArchive={vid}
          link={vid.link}
          noVideoCategory
          onClick={() => setGoToAction({ path: vid.link, actions })}
          cardHeight={500}
          disableCardAnimation
        />
      );
    });
  };
  React.useEffect(async () => {
    //Not the greatest idea to make useEffect async
    actions.source.fetch("/videos/");

    const jwt = await authenticateAppAction({ state, dispatch });
    console.log("JWT:", jwt);

    if (!post.acf.private) {
      setVideoStatus("unlocked");
      return true;
    }
    if (!isActiveUser) {
      setVideoStatus("locked");
      return true;
    }
    if (isActiveUser && post.acf.price) {
      const url =
        state.auth.APP_HOST +
        "/videvent/" +
        isActiveUser.contactid +
        "/" +
        post.acf.event_id;
      const fetching = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (fetching.ok) {
        const json = await fetching.json();
        if (json.success === false) setVideoStatus("locked");
        if (json.data.entity.bad_confirmationid) setVideoStatus("unlocked");
        return true;
      } else {
        setVideoStatus("locked");
        return true;
      }
    }
    setVideoStatus("locked");
  }, [isActiveUser, paymentUrl]);
  if (!videoStatus) return <Loading />;
  if (!state.source.videos) return <Loading />;

  const handleProblemEnquiry = () => {
    setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: "comms@bag.org.uk",
        message: true,
        allow_attachments: true,
      },
    });
  };
  return (
    <BlockWrapper>
      <PaymentModal
        payment_url={paymentUrl}
        resetPaymentUrl={resetPaymentUrl}
      />
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
        <ServeTitle />
        <div style={styles.container}>
          <div>
            <ServeContent />
            <ServeBody />
            <div
              onClick={handleProblemEnquiry}
              className="caps-btn"
              style={{ padding: 10 }}
            >
              I have a problem with this video
            </div>
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
