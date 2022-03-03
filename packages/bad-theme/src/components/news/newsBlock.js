import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "../card/card";
import { colors } from "../../config/imports";
import { muiQuery } from "../../context";

const NewsBlock = ({
  state,
  actions,
  libraries,
  categoryList,
  block,
  layout,
}) => {
  const { post_limit, category_filter } = block;
  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";
  const isLayoutFour = layout === "layout_four";
  const isLayoutFive = layout === "layout_five";

  // console.log("block length", block.length); // debug

  let gridLayoutType = `1fr`;
  if (isLayoutFour) gridLayoutType = `repeat(3, 1fr)`;
  if (isLayoutFive) gridLayoutType = `repeat(4, 1fr)`;

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridLayoutType,
        gap: 20,
      }}
    >
      {block.map((block, key) => {
        const { categories, link, title, featured_media } = block;

        const ServeImage = () => {
          if (!featured_media) return null;

          const media = state.source.attachment[featured_media];
          const alt = title.rendered || "BAD";

          return (
            <div
              style={{
                width: "100%",
                height: 400,
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

        if (isLayoutTwo)
          return (
            <Card
              key={key}
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              layout={layout}
              colour={colors.pink}
              shadow
            />
          );

        if (isLayoutThree || isLayoutFive)
          return (
            <Card
              key={key}
              link_label="Read More"
              link={link}
              newsAndMediaInfo={block}
              layout={layout}
              cardHeight={290}
              colour={colors.pink}
              shadow
            />
          );

        if (isLayoutFour)
          return (
            <div
              key={key}
              className="flex shadow"
              style={{ borderBottom: `5px solid ${colors.pink}` }}
            >
              <ServeImage />
              <Card
                key={key}
                link_label="Read More"
                link={link}
                newsAndMediaInfo={block}
                padding="1.5em 3em"
                layout={layout}
                colour={colors.pink}
                disableFooter
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
