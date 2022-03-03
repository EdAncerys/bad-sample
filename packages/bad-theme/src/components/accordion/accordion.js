import { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";

import { v4 as uuidv4 } from "uuid";

import Loading from "../loading";

import AccordionHeader from "./accordionHeader";
import AccordionBody from "./accordionBody";
import ActionPlaceholder from "../actionPlaceholder";
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
  } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical / 4;
  if (disable_vertical_padding) marginVertical = 0;

  let isBADApproved = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0) isBADApproved = true;
  let isForBADMembersOnly = false;
  if (approved_bad_members_only && !isBADApproved) isForBADMembersOnly = true;

  if (!accordion_item || isForBADMembersOnly) return null; // defensive programming

  // SERVERS ---------------------------------------------
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
        <ActionPlaceholder isFetching={isFetching} />
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
    <div style={{ margin: `0 ${marginHorizontal}px` }}>
      {accordion_item.map((block, key) => {
        // console.log(block); // debug

        return <ServeAccordion key={key} block={block} />;
      })}
    </div>
  );
};

export default connect(AccordionComponent);
