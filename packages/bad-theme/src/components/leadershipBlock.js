import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import AccordionComponent from "./accordion/accordion";
import Loading from "./loading";

// CONTEXT -----------------------------------------------------------------
import { getLeadershipTeamData } from "../helpers";

const LeadershipBlock = ({ state, actions, block }) => {
  const [leadershipList, setLeadershipList] = useState(null);
  const [gradesList, setGrades] = useState(null);
  const [positionList, setPositions] = useState(null);
  const mountedRef = useRef(true);

  if (!block) return <Loading />;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    let data = await getLeadershipTeamData({ state, actions });
    if (!data) return;

    let positionData = state.source.leadership_position;
    let gardeData = state.source.leadership_grade;

    setPositions(Object.values(positionData));
    setGrades(Object.values(gardeData));
    setLeadershipList(Object.values(data));

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

  if (!leadershipList) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <AccordionComponent
      block={{
        accordion_item: [{ leadershipList, gradesList, positionList, block }],
      }}
      leadershipBlock
    />
  );
};

const styles = {
  container: {},
};

export default connect(LeadershipBlock);
