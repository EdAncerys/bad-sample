import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

import { colors } from "../../config/imports";
import DownloadFileBlock from "../downloadFileBlock";
import CircularProgress from "@mui/material/CircularProgress";

// CONTEXT ------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  setErrorAction,
  loginAction,
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
  videoArchive,
  isFetching,
  authLink,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  // ⏬⏬  hide component if data not provided ⏬⏬
  if (!link && !form_link && !downloadFile && !handler && !rssFeedLink)
    return null;

  // HANDLERS ------------------------------------------
  const handelLogin = () => {
    setErrorAction({ dispatch, isError: null });
    loginAction({ state });
  };

  const handelRedirect = () => {
    setErrorAction({ dispatch, isError: null });
    setGoToAction({ state, path: authLink, actions });
  };

  const handleFeedLink = () => {
    // check if logged in user exists || otherwise error notification
    if (rssFeedLink && !isActiveUser) {
      // 📌 track notification error action
      setErrorAction({
        dispatch,
        isError: {
          message: `BAD members, make sure you are logged in to your BAD account to get free access to our journals.`,
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

    setGoToAction({ state, path: authLink, actions });
  };

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link || electionBlocks) return null;
    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={() => setGoToAction({ state, path: link, actions })}>
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
      <CircularProgress color="inherit" style={{ width: 20, height: 20 }} />
    );

  if (videoArchive) return null;

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
