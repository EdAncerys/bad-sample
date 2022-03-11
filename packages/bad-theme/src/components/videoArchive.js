import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import { useAppState } from "../context";
import HeroBanner from "../components/heroBanner";
import SearchContainer from "./searchContainer";
import { colors } from "../config/imports";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import Loading from "../components/loading";
import { muiQuery } from "../context";
const VideoArchive = ({ state, actions, libraries }) => {
  const [heroBannerBlock, setHeroBannerBlock] = useState();
  const [guidanceCategory, setGuidanceCategory] = useState(null);
  const [postData, setPostData] = useState(null);

  const [filters, setFilters] = useState();

  const { sm, md, lg, xl } = muiQuery();

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
  const marginVertical = state.theme.marginVertical;
  const inputSize = 20;
  // const LIMIT = 6;

  const handleFilters = () => {
    let unfilteredVideos = Object.values(state.source.videos);
    console.log("UNFILTERED:", specialtyFilter.current);

    const filteredVideos = unfilteredVideos.filter((video) => {
      if (specialtyFilter.current)
        return video.event_specialty.includes(Number(specialtyFilter.current));
      if (paidFilter.current) {
        if (paidFilter.current === "paid") return video.acf.private === true;
        if (paidFilter.current === "free")
          return video.acf.private === false || !video.acf.private;
      }
    });
    if (specialtyFilter.current === "all") {
      setPostData(unfilteredVideos);
      return true;
    }
    if (paidFilter.current === "all") {
      setPostData(unfilteredVideos);
      return true;
    }
    setPostData(filteredVideos);
    console.log(filteredVideos);
  };
  const handleSearch = (e, searchFilter) => {
    e.preventDefault();
    let unfilteredVideos = Object.values(state.source.videos);

    const regex = new RegExp(searchFilter, "gi");
    const filteredVideos = unfilteredVideos.filter((video) => {
      return (
        video.title.rendered.match(regex) || video.content.rendered.match(regex)
      );
    });
    setPostData(filteredVideos);
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
            style={styles.dropdown}
          >
            <option value="">Specialties</option>
            {data.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
            <option value="all">All specialties</option>
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
          <select
            className="form-control"
            name="payments"
            id="payments-filters"
            onChange={() => {
              const select = document.getElementById("payments-filters");
              const value = select.options[select.selectedIndex].value;
              paidFilter.current = value;
              handleFilters();
            }}
            style={{ ...styles.dropdown, height: inputSize }}
          >
            <option>Video type</option>
            <option value="all">All videos</option>
            {paymentType.map((item) => {
              return <option value={item.toLowerCase()}>{item}</option>;
            })}
          </select>
        </div>
      );
    };
    return (
      <div
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        <div
          className="primary-title"
          style={{ display: "flex", alignItems: "center" }}
        >
          Filters:{" "}
        </div>
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
  const ServeSearchFilter = () => {
    const [searchFilter, setSearchFilter] = useState("");
    const ServeIcon = () => {
      const searchIcon = <SearchIcon />;
      const closeIcon = <CloseIcon />;
      const icon = searchFilter ? closeIcon : searchIcon;

      return (
        <div
          onClick={() => {
            setSearchFilter(null);
            searchFilterRef.current.value = "";
            if (onChange) setFilterAction({ dispatch, filter: null }); // reset main search filter
          }}
        >
          {icon}
        </div>
      );
    };

    const ServeSerachButton = () => {
      return (
        <div
          style={{
            display: "grid",
            alignItems: "center",
            paddingLeft: !lg ? `2em` : 0,
            paddingTop: !lg ? null : "1em",
          }}
        >
          <button type="submit" className="blue-btn">
            Search
          </button>
        </div>
      );
    };

    return (
      <div
        className={!lg ? "flex-row" : "flex-col"}
        style={{ marginBottom: 20 }}
      >
        <form
          onSubmit={(e) => handleSearch(e, searchFilter)}
          style={{ display: "flex" }}
        >
          <input
            ref={searchFilterRef}
            onChange={(e) => setSearchFilter(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Search"
            style={!lg ? styles.input : { padding: "1em" }}
            value={searchFilter}
          />
          <div
            className="input-group-text toggle-icon-color"
            style={{
              position: "absolute",
              right: 0,
              border: "none",
              background: "transparent",
              alignItems: "center",
              color: colors.darkSilver,
              cursor: "pointer",
            }}
          >
            <ServeIcon />
          </div>
          <ServeSerachButton />
        </form>
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

      <div
        style={{
          backgroundColor: colors.lightSilver,
          paddingTop: marginVertical,
          paddingBottom: marginVertical,
        }}
      >
        <BlockWrapper>
          <div
            className="primary-title"
            style={{ fontSize: "2.25rem", marginBottom: 20 }}
          >
            Search for videos
          </div>
          <ServeSearchFilter />
          <ServeFilterMenu />
        </BlockWrapper>
      </div>
      <BlockWrapper>
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
      </BlockWrapper>

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
  dropdown: {
    width: 150,
    height: "25px",
  },
};
export default connect(VideoArchive);
