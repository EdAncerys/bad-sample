import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Card from "../card/card";
import Loading from "../loading";
import { colors } from "../../config/imports";

const NewsBlock = ({ state, actions, libraries, block }) => {
  const [postList, setPostList] = useState(null);
  const [category, setCategory] = useState(null);

  const { layout, post_limit, category_filter, colour } = block;
  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";
  const mountedRef = useRef(true);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    if (!state.source.post) {
      console.log("Error. Failed to fetch post data"); // debug
      return null;
    }
    let POST_LIST = Object.values(state.source.post); // add postData object to data array
    if (post_limit) POST_LIST = POST_LIST.slice(0, Number(post_limit)); // apply limit on posts
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      setCategory(CATEGORY);
    }

    setPostList(POST_LIST);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, [state.source.post]);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!postList || !category) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, 1fr)`,
        gap: 20,
      }}
    >
      {postList.map((block, key) => {
        const { categories, link } = block;
        const { press_release_authors } = block.acf;
        const filter = category.filter(
          (item) => item.id === Number(categories[0])
        );
        const categoryName = filter[0].name;

        if (
          !categories.includes(Number(category_filter)) &&
          Number(category_filter) !== 0
        )
          return null;

        if (isLayoutTwo)
          return (
            <Card
              key={key}
              link_label="Listen Here"
              link={link}
              newsAndMediaInfo={block}
              cardMinHeight={290}
              layout={layout}
              colour={colour}
              shadow
            />
          );

        if (isLayoutThree)
          return (
            <Card
              key={key}
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              colour={colour}
              cardHeight="100%"
              shadow
            />
          );
      })}
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
  action: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
};

export default connect(NewsBlock);
