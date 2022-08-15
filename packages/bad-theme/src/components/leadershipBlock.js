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
  // console.log("🐞 ", block); // debug

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const grades = await getLeadershipGrades({ state });
    const positions = await getLeadershipPositions({ state });
    let leadershipList = await getLeadershipData({ state });
    // sort by order in acf field
    leadershipList = leadershipList.sort((a, b) => {
      // if order is null, add to end of list
      if (a.acf.order === null) return 1;
      if (b.acf.order === null) return -1;

      return a.acf.order - b.acf.order;
    });

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
