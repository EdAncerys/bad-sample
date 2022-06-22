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
import PaymentModal from "./dashboard/paymentModal";

import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  setEnquireAction,
  muiQuery,
  setCreateAccountModalAction,
  setErrorAction,
  fetchDataHandler,
  setGoToAction,
  Parcer,
} from "../context";

const Video = ({ state, actions, libraries }) => {
  // STATE
  const [loadVideo, setLoadVideo] = React.useState(false);
  const [videoStatus, setVideoStatus] = React.useState("");
  const [paymentUrl, setPaymentUrl] = React.useState("");
  const [relatedVideos, setRelatedVideos] = React.useState(null);

  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];

  const queryParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let isSagepay = queryParams.sagepay;
  const handlePaymentModal = (url) => {
    setErrorAction({
      dispatch,
      isError: {
        message: `The card payment industry is currently in the process of making significant changes to the way card payments are processed online. Unfortunately, because of these changes, some users are experiencing temporary issues with making card payments through the website. If you cannot make a payment through the website, please contact membership@bad.org.uk to discuss alternative arrangements for making payments.`,
        image: "Error",
        goToPath: { label: "Continue", path: url },
      },
    });
  };
  const { lg } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  React.useEffect(async () => {
    //Not the greatest idea to make useEffect async
    await actions.source.fetch("/videos/");
    const all_videos = state.source.videos;
    const videos_list = await Object.values(all_videos);
    const related_videos_to_show = videos_list.slice(0, 3);

    if (isSagepay) {
      setErrorAction({
        dispatch,
        isError: {
          message: `Your payment has been accepted`,
          image: "CheckMark",
        },
      });
    }

    setRelatedVideos(related_videos_to_show);

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

      const fetching = await fetchDataHandler({
        path: url,
        state,
      });
      if (fetching.ok) {
        const json = await fetching.json();
        // if (json.success === false) setVideoStatus("locked");
        if (json.success && json.data.entity.bad_confirmationid) {
          setVideoStatus("unlocked");
          return true;
        }
        setVideoStatus("locked");
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

  // HELPERS ----------------------------------------------------------------
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const handlePayment = async () => {
    const sagepay_url =
      state.auth.ENVIRONMENT === "PRODUCTION"
        ? "/sagepay/live/video/"
        : "/sagepay/test/video/";
    const uappUrl = state.auth.APP_URL;
    const url =
      state.auth.APP_HOST +
      sagepay_url +
      isActiveUser.contactid +
      "/" +
      post.acf.event_id +
      "/" +
      post.acf.price +
      `?redirecturl=` +
      uappUrl +
      state.router.link +
      "?sagepay=true";

    const fetchVendorId = await fetchDataHandler({
      path: url,
      method: "POST",
      state,
      // isCORSHeaders: true,
      // disableCookies: true,
    });

    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      if (json.success) {
        const url =
          json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
        handlePaymentModal(url);
        return true;
      }

      setErrorAction({
        dispatch,
        isError: {
          message: `There was a problem processing the request`,
          image: "Error",
        },
      });
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
          <Parcer libraries={libraries} html={post.title.rendered} />
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

        const path = `https://vimeo.com/api/v2/video/${videoId[0]}.json`;
        const fetchVideoData = await fetchDataHandler({
          path,
          state,
          isCORSHeaders: true,
          disableCookies: true,
        });

        if (fetchVideoData.ok) {
          const json = await fetchVideoData.json();
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
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    };

    const ServeDateAndPrice = () => {
      const dateObject = new Date(post.date);
      const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

      const ServePrice = () => {
        if (!isActiveUser)
          return (
            <div>
              <div
                className="blue-btn"
                onClick={() =>
                  setCreateAccountModalAction({
                    dispatch,
                    createAccountAction: true,
                  })
                }
              >
                Login to purchase or watch this video
              </div>
            </div>
          );

        if (isActiveUser && post.acf.private && videoStatus === "locked")
          return (
            <div className="blue-btn" onClick={handlePayment}>
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
          <div>
            <span className="primary-title">Published: </span>
            {formattedDate}
          </div>
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
        recipients: state.contactList.DEFAULT_CONTACT_LIST,
        // default email subject & template name
        emailSubject: "Viewing Video Issue.",
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
