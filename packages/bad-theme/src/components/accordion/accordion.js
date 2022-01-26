import { useState, useRef, useLayoutEffect } from "react";
import { connect } from "frontity";

import Accordion from "react-bootstrap/Accordion";
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
  let marginVertical = state.theme.marginVertical;
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
      const addIcon = document.querySelector(`#add-id-${uniqueId}`);
      const removeIcon = document.querySelector(`#remove-id-${uniqueId}`);
      const preview = document.querySelector(`#preview-id-${uniqueId}`);
      const accordionBody = document.querySelector(`.accordion-${uniqueId}`);

      if (isActive.current) {
        // apply actions if accordion isActive
        if (preview) {
          preview.classList.add("d-none");
        }
        accordionBody.classList.add("border-top-show");
        addIcon.classList.add("d-none");
        removeIcon.classList.remove("d-none");
      }

      if (!isActive.current) {
        // apply actions if accordion !isActive
        if (preview) {
          preview.classList.remove("d-none");
        }
        accordionBody.classList.remove("border-top-show");
        addIcon.classList.remove("d-none");
        removeIcon.classList.add("d-none");
      }
    };

    return (
      <Accordion style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={fetching} />
        <Accordion.Item
          eventKey={uniqueId}
          id={uniqueId}
          className="shadow"
          style={{
            padding: `0.5em 1em`,
            margin: `1em 0`,
          }}
        >
          <AccordionHeader
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            handleAccordionToggle={() => {
              isActive.current = !isActive.current;
              handleAccordionToggle();
            }}
            uniqueId={uniqueId}
          />
          <AccordionBody
            block={block}
            guidelines={guidelines}
            leadershipBlock={leadershipBlock}
            uniqueId={uniqueId}
            setFetching={setFetching}
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
