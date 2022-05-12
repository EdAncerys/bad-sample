import React, { useState, useLayoutEffect } from "react";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "../blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Loading from "../loading";
import AccordionBody from "./alteraccordionBody";
import CardHeader from "./alteraccordionHeader";
import { useAppState, muiQuery } from "../../context";
import connect from "@frontity/connect";
import { v4 as uuidv4 } from "uuid";

function AlterAccordion({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  membershipApplications,
  hasPublishDate,
  hasPreview,
}) {
  function CustomToggle({ children, eventKey, callback, isActive }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      callback && callback(eventKey);
    });

    return <div onClick={decoratedOnClick}>{children}</div>;
  }

  if (!block) return <Loading />;
  const { lg } = muiQuery();
  const { dynamicsApps } = useAppState();
  const {
    disable_vertical_padding,
    accordion_item,
    approved_bad_members_only,
    add_search_function,
  } = block;

  const [searchFilter, setSearchFilter] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);

  let isBADApproved = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0) isBADApproved = true;
  let isForBADMembersOnly = false;
  if (approved_bad_members_only && !isBADApproved) isForBADMembersOnly = true;

  useLayoutEffect(() => {
    // ⬇️ re-set accordion data state on data change
    setSearchFilter(accordion_item);
    const id = uuidv4(); // add unique id
    setUniqueId(id);
  }, [accordion_item]);

  if (!searchFilter || isForBADMembersOnly) return null; // defensive programming

  const SingleItem = ({ block, id }) => {
    let isActive = false;
    if (leadershipBlock && block.block) isActive = block.block.is_active;
    if (isActive) {
      // 📌 apply show class to accordion item
      // set timeout get the accordion body with the unique id
      setTimeout(() => {
        const accordionBody = document.getElementById(uniqueId);
        if (accordionBody) accordionBody.classList.add("show");
      }, 100);
    }

    return (
      <Card
        style={{
          backgroundColor: "#fff",
          borderRadius: 0,
          marginTop: 20,
          border: 0,
        }}
        data-aos="fade"
        data-aos-easing="ease-in-sine"
        data-aos-delay={`${id}`}
        data-aos-duration="1000"
        data-aos-offset="-120"
        className="shadow"
      >
        <Card.Header
          style={{
            padding: 0,
            border: 0,
            backgroundColor: "#fff",
            paddingTop: "10px",
          }}
        >
          <CustomToggle eventKey={id} isActive={isActive}>
            <CardHeader
              id={id}
              uniqueId={id}
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
              hasPreview={hasPreview}
            />
          </CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={id} id={uniqueId}>
          <Card.Body>
            <AccordionBody
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              uniqueId={id}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
              hasPublishDate={hasPublishDate}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };

  return (
    <BlockWrapper>
      <div style={{ padding: !lg ? "0 100px" : "0 0.5em" }}>
        <Accordion style={{ border: 0 }}>
          {searchFilter.map((block, key) => {
            return <SingleItem block={block} key={key} id={key} />;
          })}
        </Accordion>
      </div>
    </BlockWrapper>
  );
}

export default connect(AlterAccordion);
