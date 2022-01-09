import { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";

import Accordion from "react-bootstrap/Accordion";
import { v4 as uuidv4 } from "uuid";

import Loading from "../loading";

import AccordionHeader from "./accordionHeader";
import AccordionBody from "./accordionBody";

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

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ---------------------------------------------
  const ServeAccordion = ({ block }) => {
    const [uniqueId, setUniqueId] = useState(null);
    // hook applies after React has performed all DOM mutations
    useLayoutEffect(() => {
      const blockId = uuidv4(); // add unique id
      setUniqueId(blockId);
    }, []);

    if (!uniqueId) return <Loading />;

    // HANDLERS ----------------------------------------------------
    const handleAccordionToggle = () => {
      const addIcon = document.querySelector(`#add-id-${uniqueId}`);
      const removeIcon = document.querySelector(`#remove-id-${uniqueId}`);
      const moreIcon = document.querySelector(`#more-id-${uniqueId}`);
      const lessIcon = document.querySelector(`#less-id-${uniqueId}`);
      const preview = document.querySelector(`#preview-id-${uniqueId}`);
      const accordionBody = document.querySelector(`.accordion-${uniqueId}`);
      // apply toggle to selected components
      if (preview) {
        preview.classList.toggle("d-none");
      }
      if (accordionBody) {
        accordionBody.classList.toggle("border-top-show");
      }
      if (addIcon) {
        addIcon.classList.toggle("d-none");
      }
      if (removeIcon) {
        if (removeIcon.classList.contains("d-none")) {
          removeIcon.classList.remove("d-none");
        } else {
          removeIcon.classList.add("d-none");
        }
      }
      if (moreIcon) {
        moreIcon.classList.toggle("d-none");
      }
      if (lessIcon) {
        if (lessIcon.classList.contains("d-none")) {
          lessIcon.classList.remove("d-none");
        } else {
          lessIcon.classList.add("d-none");
        }
      }
    };

    return (
      <Accordion>
        <Accordion.Item
          eventKey={uniqueId}
          id={uniqueId}
          className="shadow"
          style={{ padding: `0.5em 1em`, margin: `1em 0` }}
        >
          <AccordionHeader
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            handleAccordionToggle={handleAccordionToggle}
            uniqueId={uniqueId}
          />
          <AccordionBody
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            uniqueId={uniqueId}
          />
        </Accordion.Item>
      </Accordion>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      {accordion_item.map((block, key) => {
        return <ServeAccordion key={key} block={block} />;
      })}
    </div>
  );
};

export default connect(AccordionComponent);
