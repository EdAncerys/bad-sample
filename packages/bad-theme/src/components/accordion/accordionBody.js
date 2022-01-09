import { useState, useLayoutEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Accordion from "react-bootstrap/Accordion";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import DownloadFileBlock from "../downloadFileBlock";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  setGoToAction,
  sendEmailEnquireAction,
} from "../../context";

const AccordionBody = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  uniqueId,
  setFetching,
}) => {
  const dispatch = useAppDispatch();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const ALL_POSITIONS = Object.values(state.source.leadership_position);
  const {
    body,
    downloads,
    label,
    link,
    preview,
    file_submit_option,
    recipients,
  } = block;

  // HANDLERS ----------------------------------------------------
  const handleContactFormSubmit = async () => {
    const isFileUpload = document.querySelector(`#attachments-${uniqueId}`);
    const date = new Date();

    const isAttachment = isFileUpload.files.length > 0;
    if (!isAttachment) return null;

    setFetching(true);
    const attachments = isFileUpload.files;
    const formData = { date };

    await sendEmailEnquireAction({
      state,
      dispatch,
      formData,
      attachments,
      recipients,
    });
    setFetching(false);
    document.querySelector(`#attachments-${uniqueId}`).value = "";
  };

  // Guidelines & Standards -----------------------------------
  let gsDocument_uploads = null;
  let gsLinks = null;
  let gsSubtitle = null;

  if (guidelines) {
    gsDocument_uploads = block.acf.document_uploads;
    gsLinks = block.acf.links;
    gsSubtitle = block.acf.subtitle;
  }
  // Guidelines & Standards --------------------------------

  // LEadership team & Standards --------------------------------
  let ltBody = null;
  let LT_LAYOUT = null;
  let ALL_GRADES = null;

  if (leadershipBlock) {
    ltBody = block.block.intro_text;
    LT_LAYOUT = block.block.layout;
    ALL_GRADES = state.source.leadership_grade;
  }
  // LEadership team & Standards --------------------------------

  const ServeGSSubTitle = () => {
    if (!gsSubtitle) return null;

    return (
      <div className="flex">
        <Html2React html={gsSubtitle} />
      </div>
    );
  };

  const ServeGSLink = () => {
    if (!gsLinks) return null;

    return (
      <div className="flex-row" style={{ width: "50%", flexWrap: "wrap" }}>
        {gsLinks.map((link, key) => {
          return <ServeLink key={key} link={link} />;
        })}
      </div>
    );
  };

  const ServeDownloads = () => {
    if (!gsDocument_uploads && !downloads) return null;

    const files = gsDocument_uploads || downloads;

    return (
      <div className="flex-col">
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            padding: `2em 0 1em`,
          }}
        >
          Downloads:
        </div>
        <div className="flex-col" style={{ flexWrap: "wrap" }}>
          {files.map((block, key) => {
            return (
              <div
                className="flex"
                key={key}
                style={{ padding: `1em 1em 1em 0` }}
              >
                <DownloadFileBlock block={block} guidelines disableMargin />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ServeGoToPage = () => {
    if (!link || guidelines) return null;

    let LABEL = "More";
    if (label) LABEL = label;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: `1em 0`,
        }}
      >
        <div>
          <button
            className="flex-row blue-btn"
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <div className="flex">
              <Html2React html={LABEL} />
            </div>
            <div style={{ margin: "auto 0" }}>
              <KeyboardArrowRightIcon
                style={{
                  borderRadius: "50%",
                  padding: 0,
                }}
              />
            </div>
          </button>
        </div>
      </div>
    );
  };

  const ServeFileSubmit = () => {
    if (!file_submit_option) return null;

    return (
      <div
        className="flex-col"
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingBottom: `1em`,
        }}
      >
        <div>
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            File Attachments
          </div>
          <input
            id={`attachments-${uniqueId}`}
            className="form-control"
            style={{ width: "fit content", margin: `1em 0` }}
            type="file"
            multiple
          />
          <div className="blue-btn" onClick={handleContactFormSubmit}>
            Apply Here
          </div>
        </div>
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div className="text-body">
        <Html2React html={body} />
      </div>
    );
  };

  const ServeLTBody = () => {
    if (!ltBody) return null;

    return (
      <div>
        <Html2React html={ltBody} />
      </div>
    );
  };

  const ServeLTTeam = () => {
    if (!block.leadershipList) return null;

    const ServeListLayout = ({ item }) => {
      const title = item.title.rendered;
      const hospital = item.acf.hospital;
      const dates = item.acf.dates;

      const ServeTitle = () => {
        if (!title) return null;

        return (
          <div>
            <Html2React html={title} />
          </div>
        );
      };

      const ServeHospital = () => {
        if (!hospital) return null;

        return (
          <div style={{ marginRight: 10 }}>
            <Html2React html={hospital} />
          </div>
        );
      };

      const ServeDates = () => {
        if (!dates) return null;

        return (
          <div>
            <Html2React html={dates} />
          </div>
        );
      };

      return (
        <div style={styles.listLayout}>
          <ServeTitle />
          <div className="flex-row">
            <ServeHospital />
            <ServeDates />
          </div>
        </div>
      );
    };

    const ServeProfileLayout = ({ item }) => {
      const title = item.title.rendered;
      const hospital = item.acf.hospital;
      const dates = item.acf.dates;
      const image = item.acf.image;
      const positionId = item.leadership_position;

      const ServeTitle = () => {
        if (!title) return null;

        return (
          <div className="primary-title">
            <Html2React html={title} />
          </div>
        );
      };

      const ServePosition = () => {
        if (!positionId[0]) return null;

        const positionData = ALL_POSITIONS.filter(
          (position) => position.id === positionId[0]
        );
        const positionName = positionData[0].name;

        return (
          <div>
            <Html2React html={positionName} />
          </div>
        );
      };

      const ServeHospital = () => {
        if (!hospital) return null;

        return (
          <div style={{ marginRight: 10 }}>
            <Html2React html={hospital} />
          </div>
        );
      };

      const ServeDates = () => {
        if (!dates) return null;

        return (
          <div>
            <Html2React html={dates} />
          </div>
        );
      };

      const ServeCardImage = () => {
        if (!image) return null;
        const alt = title || "BAD";

        return (
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: "50%",
              overflow: "hidden",
              margin: `1em 0`,
            }}
          >
            <Image
              src={image.url}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      };

      return (
        <div
          className="flex-col"
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <ServeCardImage />
          <ServeTitle />
          <ServePosition />
          <ServeDates />
          <ServeHospital />
        </div>
      );
    };

    let isListLayout = true;
    if (LT_LAYOUT === "officer") isListLayout = false;
    if (LT_LAYOUT === "senior-management") isListLayout = false;
    const jobRole = Object.values(ALL_GRADES).filter(
      (job) => job.slug === LT_LAYOUT
    );
    let rolId = 0;
    if (jobRole[0]) rolId = jobRole[0].id;

    if (isListLayout)
      return (
        <div>
          {block.leadershipList.map((item, key) => {
            if (
              LT_LAYOUT === "executive-committee-regional" &&
              !item.leadership_grade.includes(rolId)
            )
              return null;
            if (
              LT_LAYOUT === "executive-committee-co-opted" &&
              !item.leadership_grade.includes(rolId)
            )
              return null;
            if (isListLayout) return <ServeListLayout item={item} key={key} />;
          })}
        </div>
      );

    if (!isListLayout)
      return (
        <div style={styles.profileLayout}>
          {block.leadershipList.map((item, key) => {
            if (
              LT_LAYOUT === "senior-management" &&
              !item.leadership_grade.includes(rolId)
            )
              return null;
            if (
              LT_LAYOUT === "officer" &&
              !item.leadership_grade.includes(rolId)
            )
              return null;

            return <ServeProfileLayout item={item} key={key} />;
          })}
        </div>
      );
  };

  const ServeLink = ({ link }) => {
    if (!link) return null;
    const { label, link_url } = link;

    return (
      <div style={{ margin: `2em 2em 0 0` }}>
        <div
          className="caps-btn"
          onClick={() => setGoToAction({ path: link_url, actions })}
        >
          <Html2React html={label} />
        </div>
      </div>
    );
  };

  let COLUMNS = `1fr 400px`;
  if (!gsDocument_uploads && !downloads) COLUMNS = `1fr`;

  return (
    <Accordion.Body
      className={`accordion-${uniqueId}`}
      style={{ margin: `0 1.25em`, padding: `1em 0` }}
    >
      <ServeBody />
      <ServeLTBody />

      <ServeLTTeam />
      <ServeGSSubTitle />
      <ServeGSLink />
      <div style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: 20 }}>
        <ServeDownloads />
        <div className="flex-col">
          <ServeGoToPage />
          <ServeFileSubmit />
        </div>
      </div>
    </Accordion.Body>
  );
};

const styles = {
  listLayout: {
    display: "grid",
    gridTemplateColumns: `25% auto`,
    gap: 20,
    padding: `0.5em 0`,
  },
  profileLayout: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
};

export default connect(AccordionBody);
