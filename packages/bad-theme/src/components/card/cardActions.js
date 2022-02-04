import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

import { colors } from "../../config/imports";
import DownloadFileBlock from "../downloadFileBlock";
import ActionPlaceholder from "../actionPlaceholder";
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  getWileyAction,
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

  // ⏬⏬  clear component if data not provided ⏬⏬
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
    if (isActiveUser) authLink = await getWileyAction({ state, dispatch, doi });

    setAuthLink(authLink); // set auth link via wiley
    setFetching(false);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [isActiveUser]);

  // SERVERS ---------------------------------------------
  const ServeReadMoreAction = () => {
    if (!link || electionBlocks) return null;
    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={() => setGoToAction({ path: link, actions })}>
        <div>
          <div className="caps-btn">
            <Html2React html={goToLabel} />
          </div>
        </div>
      </div>
    );
  };

  const ServeAuthRSSFeedLink = () => {
    if (!rssFeedLink) return null;

    let goToLabel = "More";
    if (link_label) goToLabel = link_label;

    return (
      <div onClick={() => setGoToAction({ path: authLink, actions })}>
        <div className="caps-btn">
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
        <div>
          <div className="caps-btn">
            <Html2React html={goToLabel} />
          </div>
        </div>
      </div>
    );
  };

  const ServeFromAction = () => {
    if (!form_link) return null;

    let goToLabel = "Nomination Form";
    if (form_label) goToLabel = form_label;

    return (
      <div>
        <div className="caps-btn">
          <a
            href={form_link}
            target="_blank"
            download
            style={{ color: colors.softBlack }}
          >
            <Html2React html={goToLabel} />
          </a>
        </div>
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
