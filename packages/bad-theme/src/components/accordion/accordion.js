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
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const { disable_vertical_padding, accordion_item, preview } = block;
  const isActive = useRef(false);

  if (!accordion_item) return null; // defensive programming

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical / 4;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block }) => {
    const [uniqueId, setUniqueId] = useState(null);
    const [fetching, setFetching] = useState(null);
    // hook applies after React has performed all DOM mutations
    useLayoutEffect(() => {
      const blockId = uuidv4(); // add unique id
      setUniqueId(blockId);
    }, []);

    if (!uniqueId) return <Loading />;

    // HANDLERS ----------------------------------------------------
    const handleAccordionToggle = () => {
      const addIcon = document.querySelector(`#add-icon-${uniqueId}`);
      const removeIcon = document.querySelector(`#remove-icon-${uniqueId}`);
      const preview = document.querySelector(`#preview-id-${uniqueId}`);
      const accordionBody = document.querySelector(
        `#accordion-body-${uniqueId}`
      );

      console.log(addIcon);
      if (!isActive.current) {
        // apply actions if accordion !isActive
        accordionBody.classList.add("show");
        if (preview) {
          preview.classList.add("d-none");
        }
        addIcon.classList.add("d-none");
        removeIcon.classList.remove("d-none");
      }

      if (isActive.current) {
        // apply actions if accordion isActive
        accordionBody.classList.remove("show");
        if (preview) {
          preview.classList.remove("d-none");
        }
        addIcon.classList.remove("d-none");
        removeIcon.classList.add("d-none");
      }

      isActive.current = !isActive.current; // toggle accordion state tracking
    };

    return (
      <div
        className="accordion shadow"
        style={{ position: "relative", margin: `${marginVertical}px 0` }}
      >
        <ActionPlaceholder isFetching={fetching} />
        <div
          className="accordion-item"
          eventKey={uniqueId}
          id={uniqueId}
          classNameName="shadow"
          style={{ padding: `0.5em 1em` }}
        >
          <AccordionHeader
            uniqueId={uniqueId}
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            handleAccordionToggle={handleAccordionToggle}
          />
          <AccordionBody
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            uniqueId={uniqueId}
            setFetching={setFetching}
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
