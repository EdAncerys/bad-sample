import { useState, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import parse from "html-react-parser";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LINK from "../../img/svg/badLink.svg";
import SearchContainer from "../../components/searchContainer";
import SearchDropDown from "../../components/searchDropDown";

import date from "date-and-time";
const DATE_MODULE = date;

import DownloadFileBlock from "../downloadFileBlock";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  sendEmailEnquireAction,
  setUserStoreAction,
  getTestUserAccountsAction,
  setIDFilterAction,
} from "../../context";

const AccordionBody = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  uniqueId,
  setFetching,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, idFilter } = useAppState();

  const testAccountsRef = useRef(null);
  const searchFilterRef = useRef(null);

  const ALL_POSITIONS = Object.values(state.source.leadership_position);
  const ICON_WIDTH = 35;
  const {
    downloads,
    button_label,
    button_link,
    link_label,
    apply_for_membership,
    file_submit_option,
    recipients,
  } = block;

  let body = block.body;
  let link = block.link;
  let amount = block.acf ? block.acf.amount : null;
  let closingDate = block.acf ? block.acf.closing_date : null;

  if (fundingBlock) body = block.acf ? block.acf.overview : null;
  if (fundingBlock) link = { url: block.acf.external_application_link };

  // HANDLERS ----------------------------------------------------
  const onClickHandler = (e) => {
    console.log(e.target.value);
  };

  const handleSearch = async () => {
    console.log("API call/search");

    const input = searchFilterRef.current.value.toLowerCase();
    if (!input) return null;

    let data = testAccountsRef.current; //

    // handle API get user data
    if (!data) data = await getTestUserAccountsAction({ state });

    let filter = data.filter((user) =>
      user.bad_listname.toLowerCase().includes(input)
    );
    // overwrite address3_addressid to title field

    if (!filter.length) filter = [{ title: { rendered: "No Results" } }];
    // setIDFilterAction({ dispatch, filter });
  };

  const handleApply = async () => {
    console.log("apply_for_membership", apply_for_membership); // debug

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: {
        core_name: "810170000", // "Label": "BAD" readonly FIELD!
        core_membershipsubscriptionplanid: apply_for_membership, // type of membership for application
        bad_applicationfor: "810170000", // silent assignment
      },
    });

    if (isActiveUser)
      setGoToAction({ path: `/membership/step-1-the-process/`, actions });
  };

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
        {gsLinks.map((button_link, key) => {
          return <ServeLink key={key} button_link={button_link} />;
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
            padding: `2em 0 0`,
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

  const ServeGoToButton = () => {
    if (!button_link || guidelines) return null;

    let LABEL = "More";
    if (button_label) LABEL = button_label;

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
            onClick={() => setGoToAction({ path: button_link.url, actions })}
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

  const ServeGoToLink = () => {
    if (!link) return null;

    let LABEL = "External Link";
    if (link_label) LABEL = link_label;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: `1em 0`,
        }}
      >
        <div className="flex">
          <div style={{ marginRight: `1em` }}>
            <Image
              src={LINK}
              style={{
                width: ICON_WIDTH,
                height: ICON_WIDTH,
              }}
            />
          </div>
          <div
            className="caps-btn"
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <div className="flex">
              <Html2React html={LABEL} />
            </div>
          </div>
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

  const ServeFundingInfo = () => {
    if (!amount || !closingDate) return null;

    const ServeAmount = () => {
      if (!amount) return null;

      return (
        <div className="flex-col">
          <Html2React html={amount} />
        </div>
      );
    };

    const ServeClosingDate = () => {
      if (!closingDate) return null;

      const dateObject = new Date(closingDate);
      const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

      return (
        <div className="flex-col">
          <Html2React html={formattedDate} />
        </div>
      );
    };

    return (
      <div className="flex-col text-body">
        <ServeAmount />
        <ServeClosingDate />
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

  const ServeLink = ({ button_link }) => {
    if (!button_link) return null;

    const { button_label, link_url, label, link } = button_link;

    return (
      <div style={{ margin: `2em 2em 0 0` }}>
        <div
          value={parse(label || button_label)}
          className="caps-btn"
          onClick={() => setGoToAction({ path: link || link_url, actions })}
        >
          <Html2React html={label || button_label} />
        </div>
      </div>
    );
  };

  const ApplyForMembership = () => {
    if (apply_for_membership === "Disabled" || !apply_for_membership)
      return null;

    return (
      <div>
        {/* <div className="shadow" style={{ padding: `1em`, margin: `1em 0` }}>
          <label>USER ID</label>
          <SearchContainer
            width="50%"
            searchFilterRef={searchFilterRef}
            handleSearch={handleSearch}
            onChange
            inputOnly
          />
          <SearchDropDown filter={idFilter} onClickHandler={onClickHandler} />
        </div> */}

        <div
          className="blue-btn"
          style={{ width: "fit-content" }}
          onClick={handleApply}
        >
          <Html2React html={`Apply for ${apply_for_membership} membership`} />
        </div>
      </div>
    );
  };

  let COLUMNS = `1fr 400px`;
  if (!gsDocument_uploads && !downloads && !link) COLUMNS = `1fr`;

  const ServeBodyActions = () => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: 20 }}>
        <div className="flex-col">
          <ServeDownloads />
          <ServeGoToLink />
        </div>
        <div className="flex-col">
          <ServeGoToButton />
          <ServeFileSubmit />
        </div>
      </div>
    );
  };

  return (
    <div
      id={`accordion-body-${uniqueId}`}
      className="accordion-collapse collapse"
    >
      <div
        className="accordion-body"
        style={{ margin: `0 1.25em`, padding: `1em 0` }}
      >
        <ServeBody />
        <ServeLTBody />

        <ServeFundingInfo />
        <ServeLTTeam />
        <ServeGSSubTitle />
        <ServeGSLink />
        <ServeBodyActions />
        <ApplyForMembership />
      </div>
    </div>
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
