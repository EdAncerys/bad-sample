import { useState, useEffect } from "react";
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

  console.log(block);

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;

    const serveDateFilter = document.querySelector(
      `#serveDateFilter${id}`
    ).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveDateFilter) {
      setDateFilter(serveDateFilter);
      // apply date filter
      let filter = postList.sort(
        (a, b) => new Date(a.acf.closing_date) - new Date(b.acf.closing_date)
      );
      if (serveDateFilter === "Date Descending") {
        filter = postList.sort(
          (a, b) => new Date(b.acf.closing_date) - new Date(a.acf.closing_date)
        );
      }
      setPostList(filter);
    }
  };

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
        // search filter options --------------------------------
        // apply search options if needed

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
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              colour={colour}
              limitBodyLength
              cardHeight="100%"
              layout={layout}
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
    color: colors.darkSilver,
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
