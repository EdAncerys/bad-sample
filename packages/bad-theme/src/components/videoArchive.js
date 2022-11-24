import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import HeroBanner from "./heroBanner";
import { colors } from "../config/imports";
import defaultCover from "../img/png/video_default.jpg";
import Loading from "../components/loading";

// CONTEXT ----------------------------------------------------------------
import {
  muiQuery,
  useAppState,
  getVideosData,
  getEventSpecialties,
  getEventGrades,
  fetchDataHandler,
} from "../context";

const VideoArchive = ({ state, actions }) => {
  const [postData, setPostData] = useState(null);
  const [heroBannerBlock, setHeroBannerBlock] = useState(null);
  const [userVideos, setUserVideos] = useState(null);

  const [videosList, setVideosList] = useState(null);
  const [eventSpec, setEventSpec] = useState(null);
  const [eventGrades, setEventGrades] = useState(null);

  const { isActiveUser } = useAppState();
  const { lg } = muiQuery();

  const searchFilterRef = useRef("");
  const specialtyFilter = useRef("");
  const paidFilter = useRef("");
  const gradeFilter = useRef("");
  const showOnlyMyVids = useRef(false);
  const marginVertical = state.theme.marginVertical;

  const handleFilters = () => {
    if (specialtyFilter.current === "all") {
      setPostData(videosList);
      return;
    }
    if (paidFilter.current === "all") {
      setPostData(videosList);
      return;
    }
    let filteredVideos = videosList;
    if (showOnlyMyVids.current === true) {
      filteredVideos = filteredVideos.filter((video) => {
        const id = video.acf.event_id;
        return userVideos.some((userVideo) => {
          return userVideo.event_id === id;
        });
      });
    }

    filteredVideos = filteredVideos.filter((video) => {
      // if video.event_specialty null, return false
      const specialty = video.event_specialty;
      const grades = video.event_grade;

      if (
        specialtyFilter.current &&
        !specialty.includes(Number(specialtyFilter.current))
      )
        return false;
      if (gradeFilter.current && !grades.includes(Number(gradeFilter.current)))
        return false;

      if (paidFilter.current) {
        if (paidFilter.current === "paid") return video.acf.private;
        if (paidFilter.current === "free") return !video.acf.private;
      }

      return true;
    });

    setPostData(filteredVideos);
  };

  const handleSearch = (e, searchFilter) => {
    e.preventDefault();
    let unfilteredVideos = videosList;

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
      if (!eventSpec) return null;
      const data = eventSpec;

      return (
        <div>
          <select
            className="form-control"
            name="specialty-filters"
            id="specialty-filters"
            value={specialtyFilter.current}
            onChange={() => {
              const select = document.getElementById("specialty-filters");
              const value = select.options[select.selectedIndex].value;
              specialtyFilter.current = value;
              handleFilters();
            }}
            style={!lg ? styles.dropdown : styles.dropdownMobile}
          >
            <option hidden>Specialties</option>
            {data.map((item, key) => {
              return (
                <option key={key} value={item.id}>
                  {item.name}
                </option>
              );
            })}
            <option value="all">All specialties</option>
          </select>
        </div>
      );
    };

    const GradeFilters = () => {
      if (!eventGrades) return null;
      const data = eventGrades;

      return (
        <div>
          <select
            className="form-control"
            name="event-grades"
            id="event-grades"
            style={!lg ? styles.dropdown : styles.dropdownMobile}
            value={gradeFilter.current}
            onChange={() => {
              const select = document.getElementById("event-grades");
              const value = select.options[select.selectedIndex].value;
              gradeFilter.current = value;
              handleFilters();
            }}
          >
            <option hidden>Grade Filters</option>
            {data.map((item, i) => {
              return (
                <option key={i} value={item.id}>
                  {item.name}
                </option>
              );
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
            value={paidFilter.current}
            onChange={() => {
              const select = document.getElementById("payments-filters");
              const value = select.options[select.selectedIndex].value;
              paidFilter.current = value;
              handleFilters();
            }}
            style={!lg ? styles.dropdown : styles.dropdownMobile}
          >
            <option hidden>Video type</option>
            <option value="all">All videos</option>
            {paymentType.map((item, key) => {
              return (
                <option key={key} value={item.toLowerCase()}>
                  {item}
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
          display: "flex",
          gap: !lg ? 20 : 5,
          flexWrap: !lg ? null : "wrap",
        }}
      >
        <div
          className="primary-title"
          style={{ display: "flex", alignItems: "center" }}
        >
          {!lg ? "Filters:" : null}
        </div>
        <SpecialtyFilters />
        <GradeFilters />
        <PaymentFilters />
        {isActiveUser && (
          <button
            className={
              showOnlyMyVids.current === true ? "blue-btn-reverse" : "blue-btn"
            }
            onClick={() => {
              const opposite = showOnlyMyVids.current;
              showOnlyMyVids.current = !opposite;
              handleFilters();
            }}
          >
            {showOnlyMyVids.current === true
              ? "Show all videos"
              : "Show only my videos"}
          </button>
        )}
        <div
          onClick={() => {
            specialtyFilter.current = "";
            paidFilter.current = "";
            gradeFilter.current = "";
            setPostData(videosList);
          }}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Reset Filters
        </div>
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
        There are no videos found
      </div>
    );
  };

  const ServeSearchFilter = () => {
    const [searchFilter, setSearchFilter] = useState("");

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
          <div className="blue-btn">Search</div>
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
          style={{ display: "flex", width: !lg ? "50%" : "100%" }}
        >
          <input
            ref={searchFilterRef}
            onChange={(e) => setSearchFilter(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Search"
            style={!lg ? { width: "50%" } : { padding: "1em", height: 40 }}
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
          ></div>
          <ServeSerachButton />
        </form>
      </div>
    );
  };
  const VideoArchivePost = ({ post }) => {
    if (post.acf.members & !isActiveUser) return null;
    // GET VIMEO COVER

    return (
      <Card
        title={post.title.rendered}
        url={defaultCover}
        body={post.content.rendered}
        publicationDate={post.date}
        videoArchive={post}
        colour={colors.orange}
        link={post.link}
        link_label="watch"
        onClick={() => setGoToAction({ state, path: post.link, actions })}
        shadow
      />
    );
  };

  useEffect(async () => {
    const videoList = await getVideosData({ state });
    const eventSpec = await getEventSpecialties({ state });
    const eventGrades = await getEventGrades({ state });

    const fetchHeroBanner = async () => {
      const path = state.source.url + "/wp-json/wp/v2/pages/7051";
      const fetchInfo = await fetchDataHandler({ path, state });

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
          disable_vertical_padding: true,
        });
      }
    };

    const fetchUserVideos = async () => {
      const path =
        state.auth.APP_HOST + `/videvent/${isActiveUser.contactid}/entities`;
      const listOfVids = await fetchDataHandler({ path, state });

      const json = await listOfVids.json();
      setUserVideos(json.data);
    };

    fetchHeroBanner();
    setVideosList(videoList);
    setPostData(videoList);
    setEventSpec(eventSpec);
    setEventGrades(eventGrades);

    if (isActiveUser) fetchUserVideos();
  }, []);

  if (!postData) return <Loading />;

  return (
    <>
      <BlockWrapper background="rgb(239, 125, 33, 0.1)">
        <HeroBanner block={heroBannerBlock} />
      </BlockWrapper>
      <div
        style={{
          backgroundColor: colors.lightSilver,
          paddingTop: marginVertical,
          paddingBottom: marginVertical,
        }}
      >
        <BlockWrapper>
          <div
            className="primary-title no-selector"
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
          <div style={!lg ? styles.container : styles.containerMobile}>
            {postData.length > 0 ? (
              postData.map((item, key) => {
                // filter videos by id
                const post = videosList.filter(
                  (post) => post.id === item.id
                )[0];

                return <VideoArchivePost key={key} post={post} />;
              })
            ) : (
              <ServeNoVideosFound />
            )}
          </div>
        ) : (
          <ServeNoVideosFound />
        )}
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  dropdown: {
    width: 150,
    height: "40px",
  },
  dropdownMobile: {
    width: 100,
    height: "40px",
  },
};
export default connect(VideoArchive);
