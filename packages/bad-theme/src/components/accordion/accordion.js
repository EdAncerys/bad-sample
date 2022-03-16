import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import CloseIcon from "@mui/icons-material/Close";

import { v4 as uuidv4 } from "uuid";

import { colors } from "../../config/imports";
import Loading from "../loading";
import AccordionHeader from "./accordionHeader";
import AccordionBody from "./accordionBody";
import ActionPlaceholder from "../actionPlaceholder";
import BlockWrapper from "../blockWrapper";
import SearchContainer from "../searchContainer";
// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const AccordionComponent = ({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  membershipApplications,
  hasPreview,
  hasPublishDate,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const { dynamicsApps } = useAppState();
  const {
    disable_vertical_padding,
    accordion_item,
    approved_bad_members_only,
    add_search_function,
  } = block;

  const [searchFilter, setSearchFilter] = useState(accordion_item);
  const [searchInput, setInput] = useState(null);
  const searchFilterRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical / 4;
  if (disable_vertical_padding) marginVertical = 0;

  let isBADApproved = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0) isBADApproved = true;
  let isForBADMembersOnly = false;
  if (approved_bad_members_only && !isBADApproved) isForBADMembersOnly = true;

  if (!accordion_item || isForBADMembersOnly) return null; // defensive programming

  // HANDLERS ---------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value;
    let filter = accordion_item;

    if (input) {
      filter = filter.filter((item) => {
        let title = item.title;
        let body = item.content;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        if (body) body = content.toLowerCase().includes(input.toLowerCase());

        return title || body;
      });
    }

    setSearchFilter(filter);
    setInput(input);
  };

  const handleClearSearchFilter = () => {
    setSearchFilter(accordion_item);
    setInput(null);
  };

  // SERVERS ---------------------------------------------
  const ServeAccordionSearchFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchInput) return null;

      return (
        <div className="shadow filter">
          <div>{searchInput}</div>
          <div className="filter-icon" onClick={handleClearSearchFilter}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          margin: `${marginVertical}px `,
          backgroundColor: colors.silverFillTwo,
          padding: "2em 0",
        }}
      >
        <BlockWrapper>
          <div
            style={{
              padding: `0 ${marginHorizontal}px`,
              width: `70%`,
            }}
            className="no-selector"
          >
            <div className="flex-row">
              <SearchContainer
                title={`Search for content`}
                searchFilterRef={searchFilterRef}
                handleSearch={handleSearch}
              />
            </div>

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeAccordion = ({ block }) => {
    const [uniqueId, setUniqueId] = useState(null);
    const [isFetching, setFetching] = useState(null);

    // hook applies after React has performed all DOM mutations
    useLayoutEffect(() => {
      const blockId = uuidv4(); // add unique id
      setUniqueId(blockId);
    }, []);

    useEffect(() => {
      // set active accordion
      const accordionBody = document.querySelector(
        `#accordion-body-${uniqueId}`
      );

      if (accordionBody && block.block && block.block.is_active)
        accordionBody.classList.add("show");
    }, [uniqueId]);

    if (!uniqueId) return <Loading />;

    // HANDLERS ----------------------------------------------------
    const handleAccordionToggle = ({ isActive }) => {
      const addIcon = document.querySelector(`#add-icon-${uniqueId}`);
      const removeIcon = document.querySelector(`#remove-icon-${uniqueId}`);
      const preview = document.querySelector(`#preview-id-${uniqueId}`);
      const accordionBody = document.querySelector(
        `#accordion-body-${uniqueId}`
      );

      if (!isActive) {
        // apply actions if accordion !isActive
        accordionBody.classList.add("show");
        if (preview) {
          preview.classList.add("d-none");
        }
        addIcon.classList.add("d-none");
        removeIcon.classList.remove("d-none");
      }

      if (isActive) {
        // apply actions if accordion isActive
        accordionBody.classList.remove("show");
        if (preview) {
          preview.classList.remove("d-none");
        }
        addIcon.classList.remove("d-none");
        removeIcon.classList.add("d-none");
      }
    };

    return (
      <div
        className="accordion shadow"
        style={{ position: "relative", margin: `${marginVertical}px 0` }}
      >
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <div
          className="accordion-item"
          id={uniqueId}
          className="shadow"
          style={{ padding: `0.5em 1em` }}
        >
          <AccordionHeader
            uniqueId={uniqueId}
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            handleAccordionToggle={handleAccordionToggle}
            fundingBlock={fundingBlock}
            membershipApplications={membershipApplications}
            hasPreview={hasPreview}
            hasPublishDate={hasPublishDate}
          />
          <AccordionBody
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            uniqueId={uniqueId}
            setFetching={setFetching}
            fundingBlock={fundingBlock}
            membershipApplications={membershipApplications}
          />
        </div>
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div>
      <ServeAccordionSearchFilter />
      <BlockWrapper>
        <div style={{ margin: `0 ${marginHorizontal}px` }}>
          {searchFilter.map((block, key) => {
            // console.log("🚀 accordion block", block); // debug

            return <ServeAccordion key={key} block={block} />;
          })}
        </div>
      </BlockWrapper>
    </div>
  );
};

export default connect(AccordionComponent);
