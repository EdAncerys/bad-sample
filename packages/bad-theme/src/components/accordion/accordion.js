import { useState, useRef, useLayoutEffect } from "react";
import { connect } from "frontity";

import { v4 as uuidv4 } from "uuid";

import Loading from "../loading";

import AccordionHeader from "./accordionHeader";
import AccordionBody from "./accordionBody";
import ActionPlaceholder from "../actionPlaceholder";

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
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const { disable_vertical_padding, accordion_item } = block;

  if (!accordion_item) return null; // defensive programming

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical / 4;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block }) => {
    const [uniqueId, setUniqueId] = useState(null);
    const [isFetching, setFetching] = useState(null);

    // hook applies after React has performed all DOM mutations
    useLayoutEffect(() => {
      const blockId = uuidv4(); // add unique id
      setUniqueId(blockId);
    }, []);

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
        return <ServeAccordion key={key} block={block} />;
      })}
    </div>
  );
};

export default connect(AccordionComponent);
