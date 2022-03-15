import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

import { colors } from "../../config/imports";
import DownloadFileBlock from "../downloadFileBlock";
import ActionPlaceholder from "../actionPlaceholder";
// CONTEXT ------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  getWileyAction,
  setErrorAction,
  setLoginModalAction,
} from "../../context";

const CardActions = ({
  state,
  actions,
  libraries,
  link_label,
  link,
  form_label,
  form_link,
  downloadFile,
  handler,
  electionBlocks,
  rssFeedLink,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [authLink, setAuthLink] = useState(null);
  const [isFetching, setFetching] = useState(null);
  const useEffectRef = useRef(null);

  // ⏬⏬  hide component if data not provided ⏬⏬
  if (!link && !form_link && !downloadFile && !handler && !rssFeedLink)
    return null;

  // HANDLERS ------------------------------------------
  useEffect(async () => {
    if (!rssFeedLink) return null;

    setFetching(true);
    const { link, doi } = rssFeedLink;
    let authLink = link;

    // ⏬⏬  validate auth link for users via wiley ⏬⏬
    // ammend link to wiley if user is logged in && user is a wiley user
    if (isActiveUser) {
      const wileyLink = await getWileyAction({ state, dispatch, doi });
      if (wileyLink) authLink = wileyLink;
    }

    setAuthLink(link); // set auth link via wiley
    setFetching(false);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [isActiveUser]);

  const handelLogin = () => {
    setErrorAction({ dispatch, isError: null });
    setLoginModalAction({ dispatch, loginModalAction: true });
  };

  const handelRedirect = () => {
    setErrorAction({ dispatch, isError: null });
    setGoToAction({ path: authLink, actions });
  };

  const handleFeedLink = () => {
    // check if logged in user exists || otherwise error notification
    if (!isActiveUser) {
      // track notification error action
      setErrorAction({
        dispatch,
        isError: {
          message: `Remember to log in to the BAD website in order to have full access to Wiley Publications.`,
          image: "Error",
          action: [
            {
              label: "Read Publication",
              handler: handelRedirect,
            },
            { label: "Login", handler: handelLogin },
          ],
        },
      });

      return;
    }
    console.log("API link", authLink); // debug

    setGoToAction({ path: authLink, actions });
  };

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link || electionBlocks) return null;
    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={() => setGoToAction({ path: link, actions })}>
        <div className="caps-btn" style={{ marginTop: "1em" }}>
          <Html2React html={goToLabel} />
        </div>
      </div>
    );
  };

  const ServeAuthRSSFeedLink = () => {
    if (!rssFeedLink) return null;

    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={handleFeedLink}>
        <div className="caps-btn" style={{ marginTop: "1em" }}>
          <Html2React html={goToLabel} />
        </div>
      </div>
    );
  };

  const ServeHandlerAction = () => {
    if (!handler) return null;

    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={handler}>
        <div className="caps-btn">
          <Html2React html={goToLabel} />
        </div>
      </div>
    );
  };

  const ServeFromAction = () => {
    if (!form_link) return null;

    let goToLabel = "Nomination Form";
    if (form_label) goToLabel = form_label;

    return (
      <div className="caps-btn-no-underline" style={{ display: "grid" }}>
        <a
          href={form_link}
          target="_blank"
          style={{ color: "inherit" }}
          download
        >
          <Html2React html={goToLabel} />
        </a>
      </div>
    );
  };

  const ServeFileAction = () => {
    if (!downloadFile) return null;

    return <DownloadFileBlock block={downloadFile} disableMargin />;
  };

  if (isFetching)
    return (
      <div>
        <div
          className="flex-row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: `1em`,
            position: "relative",
          }}
        >
          <div className="caps-btn">Loading...</div>
        </div>
      </div>
    );

  return (
    <div>
      <div
        className="flex-row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: `1em`,
          position: "relative",
          flexWrap: "wrap",
        }}
      >
        <ServeHandlerAction />
        <ServeFileAction />
        <ServeReadMoreAction />
        <ServeAuthRSSFeedLink />
        <ServeFromAction />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardActions);
