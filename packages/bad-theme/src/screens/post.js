import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Card from "../components/card/card";
import ScrollTop from "../components/scrollTop";
import Loading from "../components/loading";
// BLOCK WIDTH WRAPPER -----------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT -----------------------------------------------------------------
import { setGoToAction, muiQuery, Parcer, getNewsData } from "../context";

const Post = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { categories, title, content, excerpt, link } = post;

  const [postList, setPostList] = useState(null);
  const [catList, setCatList] = useState(null);
  const [position, setPosition] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);

    // --------------------------------------------------------------------------------
    // 📌  Fetch news & media data from wp api
    // --------------------------------------------------------------------------------
    const catList = Object.values(state.source.category);
    setCatList(catList);
    const postList = await getNewsData({ state });
    setPostList(postList);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!position) return <Loading />;

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
          <Parcer libraries={libraries} html={title.rendered} />
        </div>
      );
    };

    const ServeBody = () => {
      if (!content) return null;
      const bodyLength = content.rendered.length;

      return (
        <div className="flex-col  post-content">
          <Parcer libraries={libraries} html={content.rendered} />
          {bodyLength > 2500 && <ScrollTop />}
        </div>
      );
    };

    return (
      <div className="text-body">
        {!lg ? <ServeTitle /> : null}
        <ServeBody />
      </div>
    );
  };

  const ServeSideBar = () => {
    const ServeRelatedContent = () => {
      // show component only when postlist is fetched and not null
      if (!catList || !postList) return null;

      const currentPostCategory = post.categories[0];
      // get category name from category list
      let catName = catList.filter(
        (category) => category.id === Number(currentPostCategory)
      );
      if (catName[0]) catName = catName[0].name;
      // get list of posts where category is the same as the current post
      let relatedList = postList.filter((item) => {
        // return posts that includes current post category & dont include current post id
        return (
          item.categories.includes(currentPostCategory) && post.id !== item.id
        );
      });
      // sort relatedList by date earliest to latest
      relatedList.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      // get latest posts from the list
      relatedList = relatedList.slice(0, 3);
      if (!relatedList.length) return null; // dont render if no posts

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
                    fontSize: 12,
                    backgroundColor: colors.lightSilver,
                    textTransform: "capitalize",
                    width: "fit-content",
                  }}
                >
                  <Parcer libraries={libraries} html={catName} />
                </div>

                <div
                  className="primary-title"
                  style={{ fontSize: 16, padding: "1em 0", cursor: "pointer" }}
                  onClick={() =>
                    setGoToAction({ state, path: post.link, actions })
                  }
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
        style={
          !lg
            ? {
                display: "grid",
                gridTemplateColumns: `2.5fr 1fr`,
                gap: 20,
                padding: `${marginVertical}px ${marginHorizontal}px`,
              }
            : {
                display: "flex",
                flexDirection: "column-reverse",
                gap: 20,
                padding: `${marginVertical}px ${marginHorizontal}px`,
              }
        }
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
