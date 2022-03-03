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
    // pre fetch leadership_team data
    let iteration = 0;
    let data = state.source.leadership_team;
    while (!data) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getLeadershipTeamData({ state, actions });
      data = state.source.leadership_team;
      iteration++;
    }
    // if !data then break
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
