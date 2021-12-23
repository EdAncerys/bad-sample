import { useState, useEffect } from "react";
import { connect } from "frontity";

import AccordionComponent from "./accordion";
import Loading from "./loading";

const LeadershipBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const [leadershipList, setLeadershipList] = useState(null);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    if (!state.source.leadership_team) {
      console.log("Error. Failed to fetch leadership_team data"); // debug
      return null;
    }

    const LEADERSHIP_LIST = Object.values(state.source.leadership_team); // add leadershipTeam object to data array
    setLeadershipList(LEADERSHIP_LIST);
  }, [state.source.leadership_team]);

  // DATA pre FETCH ----------------------------------------------------------------
  if (!leadershipList) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <AccordionComponent
      block={{ accordion_item: [{ leadershipList, block }] }}
      leadershipBlock
    />
  );
};

const styles = {
  container: {},
};

export default connect(LeadershipBlock);
