import { useState, useEffect } from "react";
import { connect } from "frontity";

import AccordionComponent from "./accordion";
import Loading from "./loading";

const LeadershipBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const [leadershipList, setLeadershipList] = useState(null);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/leadership_team/`;
    await actions.source.fetch(path); // fetch CPT leadershipTeam

    const leadershipTeam = state.source.get(path);
    const { totalPages, page, next } = leadershipTeam; // check if leadershipTeam have multiple pages
    // fetch leadershipTeam via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const LEADERSHIP_LIST = Object.values(state.source.leadership_team); // add leadershipTeam object to data array
    setLeadershipList(LEADERSHIP_LIST);
  }, []);
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
