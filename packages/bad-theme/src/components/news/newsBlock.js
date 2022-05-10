import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "../card/card";
import { colors } from "../../config/imports";
// CONTEXT -----------------------------------------------------------------
import { muiQuery, getMediaCategories } from "../../context";

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
    let data = await getMediaCategories({ state });

    if (data) {
      // get e-circular category id
      const eCircularCat = data.filter((item) => item.name === "E-Circular");
      // get e-circular category id
      let eCircularCatId = null;
      if (eCircularCat[0]) eCircularCatId = eCircularCat[0].id;

      setECircularCatId(eCircularCatId);
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!block) return null;

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
        const {
          categories,
          link,
          title,
          featured_media,
          acf,
          yoast_head_json,
        } = block;

        const isECircular = null;
        if (categories) categories.includes(eCircularCatId);
        let redirectLink = link;
        // if redirec_url is set, use it
        if (acf.redirect_url) redirectLink = acf.redirect_url;

        let fileBlock = null;
        if (isECircular && acf.file_uploader) fileBlock = acf.file_uploader;

        const ServeImage = () => {
          if (!featured_media) return null;

          let media = null;
          if (yoast_head_json) media = yoast_head_json.og_image[0].url;
          const alt = title.rendered || "BAD";

          if (!media) return null;

          return (
            <div
              style={{
                width: "100%",
                height: 400,
              }}
            >
              <Image
                src={media}
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
