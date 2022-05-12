import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import Loading from "./loading";
import Accordion from "./accordion/accordion";
// CONTEXT ----------------------------------------------------------------
import { getMembershipDataAction, muiQuery } from "../context";

const BADMemberships = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { background_colour, disable_vertical_padding } = block;

  const [membershipTypes, setMembershipTypes] = useState(null);
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const useEffectRef = useRef(null);
  const { lg } = muiQuery();
  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    // pre fetch membership data
    if (!state.source.memberships)
      await getMembershipDataAction({ state, actions });

    let membershipTypes = Object.values(state.source.memberships);
    if (!membershipTypes) return null;

    membershipTypes = membershipTypes.map((membership) => {
      const data = state.source[membership.type][membership.id];
      return data;
    });
    // filter out bad memberships only
    membershipTypes = membershipTypes.filter(
      (membership) => membership.acf.bad_or_sig === "bad"
    );
    // sort memberships by bad_order accenting & if no value push to end
    membershipTypes.sort((a, b) => {
      if (a.acf.bad_order && b.acf.bad_order) {
        return a.acf.bad_order - b.acf.bad_order;
      } else if (a.acf.bad_order) {
        return -1;
      } else if (b.acf.bad_order) {
        return 1;
      } else {
        return 0;
      }
    });

    setMembershipTypes(membershipTypes);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!block || !membershipTypes) return <Loading />;

  // RETURN ---------------------------------------------------
  console.log("MEMBERSHIPS", membershipTypes);
  return (
    <div
      className="flex-col"
      style={{ margin: !lg ? `${marginVertical}px 0` : "1em" }}
    >
      {membershipTypes.map((membership, key) => {
        if (membership.id === 8800) return null;
        if (membership.id === 8801) return null;
        const { body_copy, category_types, price, bad_or_sig, bad_order } =
          membership.acf; // get the data from the memberships CPT
        const { title } = membership; // get the data from the memberships CPT
        if (bad_or_sig !== "bad") return null; // filter out the bad memberships

        let accordion_item = {
          title: title,
          subtitle: price,
          body: body_copy,
          category_types,
          bad_order,
        };

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
