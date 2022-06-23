import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import AccordionComponent from "./accordion/accordion";
import Loading from "./loading";

// CONTEXT -----------------------------------------------------------------
import {
  getLeadershipGrades,
  getLeadershipData,
  getLeadershipPositions,
} from "../context";

const LeadershipBlock = ({ state, actions, block }) => {
  const [leadershipList, setLeadershipList] = useState(null);
  const [gradesList, setGrades] = useState(null);
  const [positionList, setPositions] = useState(null);
  const mountedRef = useRef(true);

  if (!block) return <Loading />;
  console.log("🐞 ", block);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const grades = await getLeadershipGrades({ state });
    const positions = await getLeadershipPositions({ state });
    const leadershipList = await getLeadershipData({ state });

    setPositions(positions);
    setGrades(grades);
    setLeadershipList(leadershipList);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

  if (!leadershipList) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <AccordionComponent
      block={{
        accordion_item: [
          {
            leadershipList,
            gradesList,
            positionList,
            block,
          },
        ],
        is_active: block.is_active,
        disable_vertical_padding: block.disable_vertical_padding,
      }}
      leadershipBlock
    />
  );
};

const styles = {
  container: {},
};

export default connect(LeadershipBlock);
