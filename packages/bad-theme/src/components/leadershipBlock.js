import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import AccordionComponent from "./accordion/accordion";
import Loading from "./loading";

const LeadershipBlock = ({ state, actions, block }) => {
  
  const [leadershipList, setLeadershipList] = useState(null);
  const mountedRef = useRef(true)
  
  if (!block) return <Loading />;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    if (!state.source.leadership_team) {
      console.log("Error. Failed to fetch leadership_team data"); // debug
      return null;
    }

    const LEADERSHIP_LIST = Object.values(state.source.leadership_team); // add leadershipTeam object to data array
    setLeadershipList(LEADERSHIP_LIST);

    return () => {
      mountedRef.current = false;   // clean up function
    };
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
