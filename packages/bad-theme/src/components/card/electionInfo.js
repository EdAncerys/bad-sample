import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

const ElectionInfo = ({ state, actions, libraries, electionInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!electionInfo) return null;

  const { title, election_roles } = electionInfo;
  const { closing_date } = electionInfo.acf;

  const today = new Date();
  const electionClosingDate = new Date(closing_date);
  const isClosedPosition = today > electionClosingDate;

  // SERVERS ---------------------------------------------
  const ServeOfficer = () => {
    if (!election_roles.length) return null;

    const ROLES = Object.values(state.source.election_roles);
    const filter = ROLES.filter(
      (item) => item.id === Number(election_roles[0])
    );
    const name = filter[0].name;

    return (
      <div style={{ paddingBottom: isClosedPosition ? `2em` : 0 }}>
        <Html2React html={name} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!closing_date || isClosedPosition) return null;

    return (
      <div className="flex-row">
        <div>Closing Date -</div>
        <div style={{ paddingLeft: 5 }}>
          <Html2React html={closing_date} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex-col" style={{ padding: `1em 0` }}>
        <ServeOfficer />
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ElectionInfo);
