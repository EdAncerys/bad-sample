import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Card from "../components/card/card";
// BLOCK WIDTH WRAPPER -----------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT -----------------------------------------------------------------
import { setGoToAction } from "../context";
import { getPostData } from "../helpers";

const Post = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];
  console.log("post data: ", post); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { categories, title, content, excerpt, link } = post;

  const [postList, setPostList] = useState(null);
  const [catList, setCatList] = useState(null);
  const useEffectRef = useRef(null);

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

    // if !data then break
    if (data.length === 0) return;
    let categoryList = Object.values(state.source.category);

    setPostList(data);
    setCatList(categoryList);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            borderBottom: `1px solid ${colors.lightSilver}`,
            paddingBottom: `1em`,
            marginBottom: `1em`,
          }}
        >
          <Html2React html={title.rendered} />
        </div>
      );
    };

    const ServeBody = () => {
      if (!content) return null;

      return (
        <div className="flex-col">
          <Html2React html={content.rendered} />
        </div>
      );
    };

    return (
      <div className="text-body">
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  const ServeSideBar = () => {
    const ServeRelatedContent = () => {
      if (!catList || !postList) return null;

      const currentPostCategory = post.categories[0];
      // get category name from category list
      let catName = catList.filter(
        (category) => category.id === Number(currentPostCategory)
      );
      if (catName[0]) catName = catName[0].name;
      // get list of posts where category is the same as the current post
      let relatedList = postList.filter((post) => {
        return post.categories.includes(currentPostCategory);
      });
      // get latest posts from the list
      relatedList = postList.slice(0, 3);
      if (!postList.length) return null; // dont render if no posts

      return (
        <div
          className="shadow"
          style={{ marginTop: marginVertical, padding: "1em" }}
        >
          <div
            className="primary-title"
            style={{ fontSize: 20, padding: "1em 0" }}
          >
            Related Content
          </div>
          {relatedList.map((post, key) => {
            return (
              <div
                key={key}
                style={{
                  marginBottom: `1em`,
                  borderBottom: `1px solid ${colors.lightSilver}`,
                }}
              >
                <div
                  style={{
                    padding: `0.5em`,
                    backgroundColor: colors.lightSilver,
                    textTransform: "capitalize",
                    width: "fit-content",
                  }}
                >
                  {catName}
                </div>

                <div
                  className="primary-title"
                  style={{ fontSize: 16, padding: "1em 0", cursor: "pointer" }}
                  onClick={() => setGoToAction({ path: post.link, actions })}
                >
                  {post.title.rendered}
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="flex-col">
        <Card authorInfo={post} colour={colors.red} shadow cardHeight="auto" />
        <ServeRelatedContent />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `2.5fr 1fr`,
          gap: 20,
          padding: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <ServeContent />
        <ServeSideBar />
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
