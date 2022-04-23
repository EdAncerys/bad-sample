import { useState, useEffect, useRef } from "react";
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
  const { post_limit, disable_vertical_padding } = block;

  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";
  const isLayoutFour = layout === "layout_four";
  const isLayoutFive = layout === "layout_five";
  const [eCircularCatId, setECircularCatId] = useState(null);
  const useEffectRef = useRef(null);
  const { lg } = muiQuery();
  let gridLayoutType = `1fr`;
  if (isLayoutFour || isLayoutThree) gridLayoutType = `repeat(3, 1fr)`;
  if (isLayoutFive) gridLayoutType = `repeat(4, 1fr)`;
  if (lg) gridLayoutType = "1fr";
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  useEffect(async () => {
    // pre fetch post data
    let iteration = 0;
    let data = Object.values(state.source.post);
    while (data.length === 0) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getPostData({ state, actions });
      data = Object.values(state.source.post);
      iteration++;
    }

    if (state.source.category) {
      const catList = Object.values(state.source.category);
      // get e-circular category id
      const eCircularCat = catList.filter((item) => item.name === "E-Circular");
      // get e-circular category id
      let eCircularCatId = null;
      if (eCircularCat[0]) eCircularCatId = eCircularCat[0].id;

      setECircularCatId(eCircularCatId);
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridLayoutType,
        gap: 20,
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {block.map((block, key) => {
        const { categories, link, title, featured_media, acf } = block;

        const isECircular = categories.includes(eCircularCatId);
        let redirectLink = link;
        // if redirec_url is set, use it
        if (acf.redirect_url) redirectLink = acf.redirect_url;

        let fileBlock = null;
        if (isECircular && acf.file_uploader) fileBlock = acf.file_uploader;

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
              link={redirectLink}
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
              link={isECircular ? null : redirectLink}
              newsAndMediaInfo={block}
              downloadFile={isECircular ? fileBlock : null} // download file passed link
              layout={layout}
              cardMinHeight={290}
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
                link={redirectLink}
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
