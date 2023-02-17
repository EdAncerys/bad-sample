import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import Loading from "./loading";
import Accordion from "./accordion/accordion";
// CONTEXT ----------------------------------------------------------------
import {
  getMembershipDataAction,
  muiQuery,
  getMembershipData,
} from "../context";

const BADMemberships = ({ state, actions, libraries, block }) => {
  const { background_colour, disable_vertical_padding } = block;

  const [membershipTypes, setMembershipTypes] = useState(null);
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const { lg } = muiQuery();

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const url = `${state.auth.WP_HOST}/wp-json/wp/v2/memberships?&per_page=100&page=1&_fields=id,type,link,title,sig_group,acf&order=asc`;

      try {
        let res = await fetch(url); // get the data from the memberships CPT
        let memberships = await res?.json();

        // 📌 filter out bad memberships only
        memberships = memberships?.filter(
          (membership) =>
            membership?.acf?.bad_or_sig === "bad" &&
            membership?.acf?.application_status !== "Hide"
        );
        // ⬇️ sort memberships by bad_order accenting & if no value push to end
        memberships.sort((a, b) => {
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

        setMembershipTypes(memberships);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, []);

  if (!block || !membershipTypes) return <Loading />;

  // RETURN ---------------------------------------------------
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
