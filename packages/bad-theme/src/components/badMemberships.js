import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import Loading from "./loading";
import BlockWrapper from "./blockWrapper";
import Accordion from "./accordion/accordion";

const BADMemberships = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { background_colour, disable_vertical_padding } = block;

  const [membershipTypes, setMembershipTypes] = useState(null);
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const useEffectRef = useRef(null);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/memberships/`;
    await actions.source.fetch(path); // fetch membership application data
    const memberships = state.source.get(path);
    const { totalPages, page, next } = memberships; // check if memberships have multiple pages
    // fetch memberships via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    const membershipTypes = Object.values(state.source.memberships);
    if (!membershipTypes) return null;

    const response = membershipTypes.map((membership) => {
      const data = state.source[membership.type][membership.id];

      return data;
    });

    console.log(response);
    setMembershipTypes(response);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!block || !membershipTypes) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div className="flex-col" style={{ margin: `${marginVertical}px 0` }}>
      {membershipTypes.map((membership, key) => {
        const { body_copy, category_types, price } = membership.acf; // get the data from the memberships CPT
        const { title } = membership; // get the data from the memberships CPT

        const accordion_item = {
          title: title,
          subtitle: price,
        };
        console.log(accordion_item);

        return (
          <Accordion
            key={key}
            block={accordion_item}
            membershipApplications
            hasPreview={true}
          />
        );
      })}
      <BlockWrapper>
        <div>BAD</div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(BADMemberships);
