import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import { useAppState } from "../context";
import HeroBanner from "../components/heroBanner";
import SearchContainer from "./searchContainer";
import TypeFilters from "./typeFilters";
import { colors } from "../config/imports";
import CloseIcon from "@mui/icons-material/Close";

const VideoArchive = ({ state, actions, libraries }) => {
  const [heroBannerBlock, setHeroBannerBlock] = useState();
  const [guidanceCategory, setGuidanceCategory] = useState(null);
  const [postData, setPostData] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [guidanceFilter, setGuidanceFilter] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const { isActiveUser } = useAppState();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const searchFilterRef = useRef(null);
  const currentSearchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const loadMoreRef = useRef(null);
  const guidanceCategoryRef = useRef("");

  const marginHorizontal = state.theme.marginHorizontal;
  const LIMIT = 6;
  //HANDLERS
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase() || searchFilter;
    console.log("INPUCIK", input);
    currentSearchFilterRef.current = input;
    let data = state.source.get(state.router.link);

    const categoryId = guidanceCategoryRef.current.value;
    console.log("KATEGORICZKA", categoryId);
    console.log(data.items);
    if (categoryId) {
      data = data.items.filter((item) =>
        item.guidance_category.includes(Number(categoryId))
      );
    }

    if (!!input) {
      data = data.items.filter((item) => {
        let title = item.link;
        // let content = item.content.rendered;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        // if (content)
        //   content = content.toLowerCase().includes(input.toLowerCase());

        // return title || content;
        return title;
      });
    }
    console.log("DATA AFTER FILTER", data);
    setPostData(data);
    setSearchFilter(input);
    if (categoryId) setGuidanceFilter(categoryId);
  };

  const handleTypeSearch = () => {
    const input = typeFilterRef.current;
    const categoryId = guidanceCategoryRef.current.value;
    let data = Object.values(state.source[postPath]); // add postListData object to data array

    if (categoryId) {
      data = data.filter((item) =>
        item.guidance_category.includes(Number(categoryId))
      );
    }

    if (currentSearchFilterRef.current)
      data = data.filter((item) => {
        let title = item.title.rendered;
        let content = item.content.rendered;
        if (title)
          title = title.toLowerCase().includes(currentSearchFilterRef.current);
        if (content)
          content = content
            .toLowerCase()
            .includes(currentSearchFilterRef.current);

        return title || content;
      });
  };

  const handleClearSearchFilter = () => {
    console.log("CLEAR FILTER");
    let data = state.source.videos; // add postListData object to data array
    console.log("DATA CLEARER", data);
    setSearchFilter(null);
    searchFilterRef.current = null;
    currentSearchFilterRef.current = null;

    if (!typeFilterRef.current) {
      setPostData(data.slice(0, Number(LIMIT)));
    } else {
      handleTypeSearch();
    }
  };

  const handleClearCategoryFilter = () => {
    let data = Object.values(state.source[postPath]); // add postListData object to data array
    guidanceCategoryRef.current = "";
    setGuidanceFilter(null);
    setPostListData(data.slice(0, Number(LIMIT)));

    handleTypeSearch();
  };

  const handleClearTypeFilter = () => {
    typeFilterRef.current = null;
    let data = Object.values(state.source[postPath]); // add postListData object to data array

    if (!currentSearchFilterRef.current) {
      setPostListData(data.slice(0, Number(post_limit || LIMIT)));
    } else {
      handleSearch();
    }
  };
  // SERVERS
  const ServeNoVideosFound = () => {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "5em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        "There are no videos found"
      </div>
    );
  };
  const ServeFilter = () => {
    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <>
          Your search query:{" "}
          <div className="shadow filter">
            <div>{searchFilter}</div>
            <div className="filter-icon" onClick={handleClearSearchFilter}>
              <CloseIcon
                style={{
                  fill: colors.darkSilver,
                  padding: 0,
                }}
              />
            </div>
          </div>
        </>
      );
    };

    const ServeGuidanceFilter = () => {
      if (!guidanceFilter) return null;

      let name = "Category";
      name = guidanceCategory.filter(
        (item) => item.id === Number(guidanceFilter)
      )[0];
      if (name) name = name.name; // apply category filter name

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={handleClearCategoryFilter}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    const ServeGuidanceType = () => {
      if (!guidanceCategory) return null;

      return (
        <div
          style={{
            marginTop: "auto",
            // padding: `1em 0 1em ${state.theme.marginVertical}px`,
          }}
        >
          <select
            name="guidance"
            ref={guidanceCategoryRef}
            value={guidanceCategoryRef.current.value}
            onChange={handleSearch}
            className="input"
            style={{ height: 45 }}
          >
            <option value="" hidden>
              Select Guidance Category
            </option>
            {guidanceCategory.map((item, key) => {
              return (
                <option key={key} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          // marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
      >
        <BlockWrapper>
          <div
            style={{
              padding: `0 ${marginHorizontal}px`,
              width: "100%",
            }}
            className="no-selector"
          >
            <div className="flex-row">
              <SearchContainer
                title="Search for Videos"
                searchFilterRef={searchFilterRef}
                handleSearch={handleSearch}
              />
              <ServeGuidanceType />
            </div>

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
              <ServeGuidanceFilter />
            </div>
            <TypeFilters
              filters={groupeType}
              handleSearch={handleTypeSearch}
              typeFilterRef={typeFilterRef}
              handleClearTypeFilter={handleClearTypeFilter}
              title="Filter"
            />
          </div>
        </BlockWrapper>
      </div>
    );
  };
  const VideoArchive = ({ post }) => {
    // GET VIMEO COVER
    const [vimeoCover, setVimeoCover] = React.useState(
      "https://badadmin.skylarkdev.co/wp-content/uploads/2022/02/VIDEO-LIBRARY.jpg"
    );

    if (post.acf.private && !isActiveUser) return null; // If user isn't logged in, the videos set to private will not show

    const getVimeoCover = async ({ video_url }) => {
      console.log("VIDEOURL", video_url);
      // Example URL: https://player.vimeo.com/video/382577680?h=8f166cf506&color=5b89a3&title=0&byline=0&portrait=0
      const reg = /\d+/g;
      const videoId = video_url.match(reg);
      console.log("VIDELOID", videoId);
      const fetchVideoData = await fetch(
        `http://vimeo.com/api/v2/video/${videoId[0]}.json`
      );
      if (fetchVideoData.ok) {
        const json = await fetchVideoData.json();
        console.log(json[0].thumbnail_medium);
        setVimeoCover(json[0].thumbnail_large);
      }
    };

    useEffect(() => {
      getVimeoCover({ video_url: post.acf.video });
    }, []);

    return (
      <Card
        title={post.title.rendered}
        url={vimeoCover}
        body={post.content.rendered}
        publicationDate={post.date}
        videoArchive={post}
        colour={colors.orange}
      />
    );
  };

  useEffect(() => {
    actions.source.fetch("/videos/");

    const fetchHeroBanner = async () => {
      const fetchInfo = await fetch(
        "https://badadmin.skylarkdev.co/wp-json/wp/v2/pages/7051"
      );

      if (fetchInfo.ok) {
        const json = await fetchInfo.json();
        setHeroBannerBlock({
          background_image: json.acf.hero_banner_picture,
          title: "BAD Video Library",
          body: json.acf.hero_banner_content,
          content_height: "regular",
          layout: "50-50",
          padding: "small",
          text_align: "left",
          colour: colors.orange,
          pop_out_text: "true",
          background_colour: rgb(239, 125, 33, 0.1),
        });
      }
    };
    const data = state.source.get(state.router.link);
    setPostData(data.items);
    console.log("DATERO ", data);
    fetchHeroBanner();
  }, []);
  if (!postData) return null;
  return (
    <>
      <HeroBanner block={heroBannerBlock} />

      <BlockWrapper>
        <ServeFilter />
        {postData ? (
          <div style={styles.container}>
            {postData.length > 0 ? (
              postData.map((item) => {
                const post = state.source[item.type][item.id];
                return <VideoArchive post={post} />;
              })
            ) : (
              <ServeNoVideosFound />
            )}
          </div>
        ) : (
          <ServeNoVideosFound />
        )}
        {/* {postData ? 
        <div style={styles.container}>
          {postData.length > 0 ? (
            postData.map((item) => {
              const post = state.source[item.type][item.id];
              return <VideoArchive post={post} />
            }
            </div>  : (
            <ServeNoVideosFound />
          )} */}
      </BlockWrapper>
    </>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 10,
  },
};
export default connect(VideoArchive);
