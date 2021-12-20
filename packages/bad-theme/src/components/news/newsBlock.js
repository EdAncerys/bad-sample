import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "../card/card";
import Loading from "../loading";
import { colors } from "../../config/colors";

const NewsBlock = ({
  state,
  actions,
  libraries,
  block,
  searchFilter,
  dateFilter,
}) => {
  const [postList, setPostList] = useState(null);
  const [category, setCategory] = useState(null);

  const { layout, post_limit } = block;
  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";

  // if (!isLayoutThree) return null;

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
    <div style={styles.container}>
      {postList.map((block, key) => {
        // search filter options --------------------------------
        // apply search options if needed

        const { categories, title, content, excerpt, link } = block;
        const { press_release_authors } = block.acf;
        const filter = category.filter(
          (item) => item.id === Number(categories[0])
        );
        const categoryName = filter[0].name;

        if (isLayoutTwo)
          return (
            <Card
              key={key}
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              colour={
                press_release_authors ? press_release_authors[0].colour : null
              }
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
              title={categoryName}
              body={excerpt.rendered}
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              colour={
                press_release_authors ? press_release_authors[0].colour : null
              }
              limitBodyLength
              cardHeight="100%"
              shadow
            />
          );
      })}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    gap: 20,
  },
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
  closeAction: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(NewsBlock);
