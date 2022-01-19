import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

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
  const isLayoutFour = layout === "layout_four";

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isLayoutFour ? `1fr` : `repeat(3, 1fr)`,
        gap: 20,
      }}
    >
      {newsList.map((block, key) => {
        const { categories, link, title, featured_media } = block;
        const filter = categoryList.filter(
          (item) => item.id === Number(categories[0])
        );
        const categoryName = filter[0].name;

        const ServeImage = () => {
          if (!featured_media) return null;

          const media = state.source.attachment[featured_media];
          const alt = title.rendered || "BAD";

          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderBottom: `5px solid ${colour}`,
              }}
            >
              <Image
                src={media.source_url}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        };

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
              layout={layout}
              cardHeight={290}
              colour={colour}
              shadow
            />
          );

        if (isLayoutFour)
          return (
            <div key={key} className="flex shadow" style={{ height: 410 }}>
              <ServeImage />
              <Card
                key={key}
                link_label="Read More"
                link={link}
                newsAndMediaInfo={block}
                padding="1.5em 3em"
                layout={layout}
                colour={colour}
              />
            </div>
          );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsBlock);
