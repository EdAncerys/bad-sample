import React from "react";
import { connect } from "frontity";
import Loading from "./loading";
import BlockWrapper from "./blockWrapper";
import Card from "./card/card";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LockIcon from "@mui/icons-material/Lock";
import defaultCover from "../img/png/video_default.jpg";
import { handleGetCookie } from "../helpers/cookie";
import PaymentModal from "./dashboard/paymentModal";

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  authenticateAppAction,
  setEnquireAction,
  muiQuery,
} from "../context";

const Video = ({ state, actions, libraries }) => {
  // STATE
  const [loadVideo, setLoadVideo] = React.useState(false);
  const [videoStatus, setVideoStatus] = React.useState("");
  const [paymentUrl, setPaymentUrl] = React.useState("");
  const [relatedVideos, setRelatedVideos] = React.useState(null);
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];
  // console.log("post data: ", post); // debug
  const { lg } = muiQuery();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();
  console.log("USERO", isActiveUser);
  React.useEffect(async () => {
    //Not the greatest idea to make useEffect async
    await actions.source.fetch("/videos/");
    const all_videos = state.source.videos;
    const videos_list = await Object.values(all_videos);
    const related_videos_to_show = videos_list.slice(0, 3);
    console.log("FELICITA", related_videos_to_show);
    setRelatedVideos(related_videos_to_show);
    const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

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

  if (!post) return <Loading />;
  if (!videoStatus) return <Loading />;
  if (!state.source.videos) return <Loading />;

  // HELPERS
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const handlePayment = async () => {
    const cookie = handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;
    const sagepay_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "/sagepay/live/video/"
        : "/sagepay/live/video/";
    const the_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000/"
        : state.auth.APP_URL;

    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        sagepay_url +
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

  //SERVERS ----------------------------------------------------
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
      const [videoCover, setVideoCover] = React.useState(defaultCover);
      const getVimeoCover = async ({ video_url }) => {
        // Example URL: https://player.vimeo.com/video/382577680?h=8f166cf506&color=5b89a3&title=0&byline=0&portrait=0
        const reg = /\d+/g;
        const videoId = video_url.match(reg);
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
            <div className="blue-btn" onClick={() => handlePayment()}>
              Buy for £{post.acf.price}
            </div>
          );

        if (post.acf.private && videoStatus === "unlocked")
          return (
            <div
              className="primary-title"
              style={{ fontSize: 20, display: "flex", alignItems: "center" }}
            >
              You have access to this video
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
        onClick={() => setGoToAction({ state, path: post.link, actions })}
        shareToSocials
        disableCardAnimation
      />
    );
  };

  const RelatedVideos = () => {
    if (!relatedVideos) return null;
    if (relatedVideos.length < 3) return null;
    return relatedVideos.map((vid, key) => {
      if (vid.id === post.id) vid = relatedVideos[2];
      if (key > 1) return null;
      return (
        <Card
          key={key}
          title={vid.title.rendered}
          url="https://i.vimeocdn.com/video/843761302-3d7f394aea80c28b923cee943e3a6be6c0f23410043d41daf399c9a57d19a191-d_640"
          body={vid.content.rendered}
          colour={colors.orange}
          videoArchive={vid}
          link={vid.link}
          noVideoCategory
          onClick={() => setGoToAction({ state, path: vid.link, actions })}
          cardHeight={500}
          disableCardAnimation
        />
      );
    });
  };

  const handleProblemEnquiry = () => {
    setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: "comms@bag.org.uk",
        message: true,
        allow_attachments: true,
        recipients: [
          {
            email: "dominik@skylarkcreative.co.uk",
          },
        ],
        // default email subject & template name
        emailSubject: "Viewing Video Issue.",
        emailTemplate: "StandardEnquiryForm",
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
        <div style={!lg ? styles.container : styles.containerMobile}>
          <div>
            <ServeContent />
            <ServeBody />
            <div
              onClick={handleProblemEnquiry}
              className="caps-btn"
              style={{ padding: 10 }}
            >
              Having trouble viewing this video?
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
  },
};
export default connect(Video);
