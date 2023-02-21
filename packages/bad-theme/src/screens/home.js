import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

// COMPONENTS ----------------------------------------------------------------
import BlockBuilder from "../components/builder/blockBuilder";
import Loading from "../components/loading";

const Home = ({ state, actions, libraries }) => {
  const [wpBlocks, setWpBlocks] = useState(null);

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  Home page data prefetch
    // --------------------------------------------------------------------------------
    (async () => {
      try {
        await actions.source.fetch(`/home-page`); // pre fetch home page CONTENT
        const home = await state.source["page"][22];
        // console.log("home data: ", home); // debug
        setWpBlocks(home?.acf?.blocks);
      } catch (error) {
        // console.log("error", error);
      }
    })();
  }, []);

  if (!wpBlocks) return <Loading />;

  return (
    <div>
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Home);
