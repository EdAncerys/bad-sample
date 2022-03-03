import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import Loading from "./loading";
import Accordion from "./accordion/accordion";
// CONTEXT ----------------------------------------------------------------
import { getMembershipDataAction } from "../context";

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
    // pre fetch membership data
    if (!state.source.memberships)
      await getMembershipDataAction({ state, actions });

    const membershipTypes = Object.values(state.source.memberships);
    if (!membershipTypes) return null;

    const response = membershipTypes.map((membership) => {
      const data = state.source[membership.type][membership.id];

      return data;
    });

    // console.log(response); // debug
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
        const { body_copy, category_types, price, bad_or_sig } = membership.acf; // get the data from the memberships CPT
        const { title } = membership; // get the data from the memberships CPT

        const accordion_item = {
          title: title,
          subtitle: price,
          body: body_copy,
          category_types,
        };
        if (bad_or_sig !== "bad") return null; // filter out the bad memberships

        return (
          <Accordion
            key={key}
            block={{ accordion_item: [accordion_item] }}
            membershipApplications
            hasPreview={true}
          />
        );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(BADMemberships);
