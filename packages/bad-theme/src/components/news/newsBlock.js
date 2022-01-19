import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "../card/card";
import { colors } from "../../config/imports";

const NewsBlock = ({
  state,
  actions,
  libraries,
  newsList,
  categoryList,
  block,
}) => {
  const { layout, post_limit, category_filter, colour } = block;
  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, 1fr)`,
        gap: 20,
      }}
    >
      {newsList.map((block, key) => {
        const { categories, link } = block;
        const filter = categoryList.filter(
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
              cardHeight={290}
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
  container: {},
};

export default connect(NewsBlock);
