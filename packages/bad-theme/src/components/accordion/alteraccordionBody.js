import { useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import parse from "html-react-parser";
// --------------------------------------------------------------------------------
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LINK from "../../img/svg/badLink.svg";
import DownloadFileBlock from "../downloadFileBlock";
import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  sendEmailEnquireAction,
  handleApplyForMembershipAction,
  anchorScrapper,
  setErrorAction,
  muiQuery,
  Parcer,
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
  membershipApplications,
  hasPublishDate,
}) => {
  const { sm, md, lg, xl } = muiQuery();
  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();

  const ICON_WIDTH = 35;
  const {
    downloads,
    button_label,
    button_link,
    link_label,
    file_submit_option,
    recipients,
    category_types,
    links,
    gradesList,
    positionList,
    acf,
  } = block;

  let body = block.body;
  let link = block.link;
  let amount = block.acf ? block.acf.amount : null;
  let openingDate = block.acf ? block.acf.opening_date : null;
  let closingDate = block.acf ? block.acf.closing_date : null;
  let labelName = link_label;

  if (fundingBlock) body = block.acf ? block.acf.overview : null;
  if (fundingBlock) labelName = block.acf ? block.acf.link_label : null;
  if (fundingBlock) link = { url: block.acf.external_application_link };

  useEffect(() => {
    // ⬇️ anchor tag scrapper
    anchorScrapper();
  }, []);

  // HANDLERS ----------------------------------------------------
  const handleApply = async () => {
    try {
      await handleApplyForMembershipAction({
        state,
        actions,
        dispatch,
        applicationData,
        isActiveUser,
        dynamicsApps,
        category: "BAD",
        type: category_types, // application type name
        membershipApplication: {
          stepOne: false,
          stepTwo: false,
          stepThree: false,
          stepFour: false,
        },
      });
    } catch (error) {
      // console.log(error);

      setErrorAction({
        dispatch,
        isError: {
          message: `There was an error creating your application. Please try again.`,
          image: "Error",
        },
      });
    }
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
      isActiveUser,
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

  if (leadershipBlock) {
    ltBody = block.block.intro_text;
    LT_LAYOUT = block.block.layout;
  }
  // LEadership team & Standards --------------------------------

  const ServeGSSubTitle = () => {
    if (!gsSubtitle) return null;

    return (
      <div className="flex">
        <Parcer libraries={libraries} html={gsSubtitle} />
      </div>
    );
  };

  const ServeGSLink = () => {
    if (!gsLinks) return null;

    return (
      <div
        className="flex-row"
        style={{ width: !lg ? "50%" : "100%", flexWrap: "wrap" }}
      >
        {gsLinks.map((button_link, key) => {
          return <ServeLink key={key} button_link={button_link} />;
        })}
      </div>
    );
  };

  const ServePublishedDate = () => {
    if (!hasPublishDate || !acf) return null;

    const date = acf.published_date;
    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          whiteSpace: "nowrap",
          paddingBottom: 4, // compensate line height
        }}
      >
        Published {formattedDate}
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
          Links and Downloads:
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

    let linkLabel = "More";
    if (button_label) linkLabel = button_label;

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
          <div
            className="flex-row blue-btn"
            onClick={() =>
              setGoToAction({ state, path: button_link.url, actions })
            }
          >
            <div className="flex">
              <Parcer libraries={libraries} html={linkLabel} />
            </div>
            <div style={{ margin: "auto 0" }}>
              <KeyboardArrowRightIcon
                style={{
                  borderRadius: "50%",
                  padding: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeGoToLink = () => {
    if (!link || guidelines) return null;

    let linkLabel = "External Link";
    if (labelName) linkLabel = labelName;

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
            className="caps-btn-no-underline"
            style={{ boxShadow: "none", display: "grid", alignItems: "center" }}
            onClick={() => setGoToAction({ state, path: link.url, actions })}
          >
            <div className="flex">
              <Parcer libraries={libraries} html={linkLabel} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeGoToLinkRepeater = () => {
    if (!links) return null;

    return (
      <div style={{ display: "grid", gap: `0.5em` }}>
        {links.map((block, key) => {
          const { label, link } = block;

          let linkLabel = "External Link";
          if (label) linkLabel = label;

          return (
            <div className="flex" key={key}>
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
                className="caps-btn-no-underline"
                style={{
                  boxShadow: "none",
                  display: "grid",
                  alignItems: "center",
                }}
                onClick={() =>
                  setGoToAction({ state, path: link.url, actions })
                }
              >
                <div className="flex">
                  <Parcer libraries={libraries} html={linkLabel} />
                </div>
              </div>
            </div>
          );
        })}
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
        <Parcer libraries={libraries} html={body} />
      </div>
    );
  };

  const ServeFundingInfo = () => {
    const ServeAmount = () => {
      if (!amount) return null;

      return (
        <div className="flex-col">
          <Parcer libraries={libraries} html={amount} />
        </div>
      );
    };

    const ServeClosingDate = () => {
      if (!closingDate && !openingDate) return null;

      let formOpeningDate = "";
      let formClosingDate = "";

      if (openingDate) {
        const openingDateObject = new Date(openingDate);
        formOpeningDate = DATE_MODULE.format(openingDateObject, "DD MMM YYYY");
      }
      if (closingDate) {
        const closingDateObject = new Date(closingDate);
        formClosingDate = DATE_MODULE.format(closingDateObject, "DD MMM YYYY");
      }

      return (
        <div className="flex-col">
          {openingDate && (
            <div>
              Opening Date:{" "}
              <Parcer libraries={libraries} html={formOpeningDate} />
            </div>
          )}
          {closingDate && (
            <div>
              Closing Date:{" "}
              <Parcer libraries={libraries} html={formClosingDate} />
            </div>
          )}
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
        <Parcer libraries={libraries} html={ltBody} />
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
            <Parcer libraries={libraries} html={title} />
          </div>
        );
      };

      const ServeHospital = () => {
        if (!hospital) return null;

        return (
          <div style={{ marginRight: 10 }}>
            <Parcer libraries={libraries} html={hospital} />
          </div>
        );
      };

      const ServeDates = () => {
        if (!dates) return null;

        return (
          <div>
            <Parcer libraries={libraries} html={dates} />
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
            <Parcer libraries={libraries} html={title} />
          </div>
        );
      };

      const ServePosition = () => {
        if (!positionId[0] || !positionList) return null;

        const position = positionList.filter(
          (position) => position.id === positionId[0]
        );

        if (!position.length) return null;
        const positionName = position[0].name;

        return (
          <div>
            <Parcer libraries={libraries} html={positionName} />
          </div>
        );
      };

      const ServeHospital = () => {
        if (!hospital) return null;

        return (
          <div style={{ marginRight: 10 }}>
            <Parcer libraries={libraries} html={hospital} />
          </div>
        );
      };

      const ServeDates = () => {
        if (!dates) return null;

        return (
          <div>
            <Parcer libraries={libraries} html={dates} />
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
    let jobRole = null;
    if (gradesList)
      jobRole = gradesList.filter((job) => job.slug === LT_LAYOUT);
    let rolId = 0;
    if (jobRole && jobRole[0]) rolId = jobRole[0].id;

    if (isListLayout)
      return (
        <div>
          {block.leadershipList.map((item, key) => {
            if (
              LT_LAYOUT === "executive-committee-regional" &&
              // if meber rolId is not included in the list of roles
              item.leadership_grade[0] !== rolId
            )
              return null;
            if (
              LT_LAYOUT === "executive-committee-co-opted" &&
              item.leadership_grade[0] !== rolId
            )
              return null;

            return <ServeListLayout item={item} key={key} />;
          })}
        </div>
      );

    return (
      <div style={!lg ? styles.profileLayout : styles.profileLayoutMobile}>
        {block.leadershipList.map((item, key) => {
          if (
            LT_LAYOUT === "senior-management" &&
            item.leadership_grade[0] !== rolId
          )
            return null;
          if (LT_LAYOUT === "officer" && item.leadership_grade[0] !== rolId)
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
          onClick={() =>
            setGoToAction({ state, path: link || link_url, actions })
          }
        >
          <Parcer libraries={libraries} html={label || button_label} />
        </div>
      </div>
    );
  };

  const ApplyForMembership = () => {
    if (!membershipApplications) return null;

    return (
      <div>
        <div
          className="blue-btn"
          style={{ width: "fit-content" }}
          onClick={handleApply}
        >
          <Parcer
            libraries={libraries}
            html={`Apply for ${category_types} membership`}
          />
        </div>
      </div>
    );
  };

  let COLUMNS = !lg ? `1fr 400px` : `1fr`;
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
    <div id={`accordion-body-${uniqueId}`}>
      <div
        className="accordion-body accordion-content"
        style={{ padding: `1em 0` }}
      >
        <ServeBody />
        <ServeLTBody />

        <ServeFundingInfo />
        <ServeLTTeam />
        <ServeGSSubTitle />
        <ServePublishedDate />
        <ServeGSLink />
        <ServeBodyActions />
        <ServeGoToLinkRepeater />
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
  listLayouMobile: {
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
  profileLayoutMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    gap: 20,
  },
};

export default connect(AccordionBody);
