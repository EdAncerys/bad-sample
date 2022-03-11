import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import { useAppState } from "../context";
import HeroBanner from "../components/heroBanner";
import SearchContainer from "./searchContainer";
import { colors } from "../config/imports";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../components/loading";
const VideoArchive = ({ state, actions, libraries }) => {
  const [heroBannerBlock, setHeroBannerBlock] = useState();
  const [guidanceCategory, setGuidanceCategory] = useState(null);
  const [postData, setPostData] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [filters, setFilters] = useState();

  const searchFilterRef = useRef(null);
  const currentSearchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const loadMoreRef = useRef(null);
  const specialtyRef = useRef(null);
  const useEffectRef = useRef(null);
  const specialtyFilter = useRef(null);
  const paidFilter = useRef(null);
  const categoryFilter = null;
  const guidanceFilter = null;
  const marginHorizontal = state.theme.marginHorizontal;
  // const LIMIT = 6;

  const handleFilters = () => {
    const unfilteredVideos = Object.values(state.source.videos);
    console.log("UNFILTERED:", specialtyFilter.current);
    const filteredVideos = unfilteredVideos.filter((video) => {
      if (specialtyFilter.current)
        return video.event_specialty.includes(Number(specialtyFilter.current));
      if (paidFilter.current === "paid") return video.acf.price !== null;
      if (paidFilter.current === "free") return video.acf.price === null;
    });
    setPostData(filteredVideos);
    console.log(filteredVideos);
  };
  const ServeFilterMenu = () => {
    const SpecialtyFilters = () => {
      if (!state.source.event_specialty) return null;
      const data = Object.values(state.source.event_specialty);

      return (
        <div>
          <select
            className="form-control"
            name="specialty-filters"
            id="specialty-filters"
            onChange={() => {
              const select = document.getElementById("specialty-filters");
              const value = select.options[select.selectedIndex].value;
              specialtyFilter.current = value;
              handleFilters();
            }}
          >
            <option value="">All specialties</option>
            {data.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
        </div>
      );
    };
    const GradeFilters = () => {
      if (!state.source.event_grade) return null;
      const data = Object.values(state.source.event_grade);

      return (
        <div>
          <select
            className="form-control"
            name="event-grades"
            id="event-grades"
          >
            <option value="">Grade Filters</option>
            {data.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
        </div>
      );
    };
    const PaymentFilters = () => {
      const paymentType = ["Paid", "Free"];
      return (
        <div>
          <select className="form-control" name="payments" id="payments">
            <option value="">Video type</option>
            {paymentType.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
        </div>
      );
    };
    return (
      <div>
        <div className="primary-title">Filters: </div>
        <SpecialtyFilters />
        <GradeFilters />
        <PaymentFilters />
      </div>
    );
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
      if (!filters.specialty) return null;

      return (
        <div
          style={{
            marginTop: "auto",
            // padding: `1em 0 1em ${state.theme.marginVertical}px`,
          }}
        >
          <select
            name="guidance"
            ref={filters.specialty}
            value={filters.specialty}
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
                // handleSearch={handleSearch}
              />
              {/* <ServeGuidanceType /> */}
              {/* <ServeFilter /> */}
            </div>

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeFilterMenu />
              {/* <ServeSearchFilter /> */}
              {/* <ServeGuidanceFilter /> */}
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };
  const VideoArchivePost = ({ post }) => {
    // GET VIMEO COVER
    const vimeoCover =
      "https://badadmin.skylarkdev.co/wp-content/uploads/2022/02/VIDEO-LIBRARY.jpg";

    return (
      <Card
        title={post.title.rendered}
        url={vimeoCover}
        body={post.content.rendered}
        publicationDate={post.date}
        videoArchive={post}
        colour={colors.orange}
        link={post.link}
        link_label="watch"
        onClick={() => setGoToAction({ path: post.link, actions })}
      />
    );
  };

  useEffect(async () => {
    actions.source.fetch("/videos/");
    actions.source.fetch("/event_specialty/");

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
          background_colour: "rgb(239, 125, 33, 0.1)",
        });
      }
    };

    const data = state.source.get(state.router.link);
    setPostData(data.items);

    console.log("DATERO ", data);
    fetchHeroBanner();
  }, []);
  if (!postData) return <Loading />;
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
                return <VideoArchivePost post={post} />;
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
    marginTop: 20,
  },
};
export default connect(VideoArchive);
