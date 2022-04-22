import { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Card from "./card/card";
import BlockWrapper from "./blockWrapper";
import HeroBanner from "./heroBanner";
import { colors } from "../config/imports";
import defaultCover from "../img/png/video_default.jpg";
import Loading from "../components/loading";
import { handleGetCookie } from "../helpers/cookie";

// CONTEXT ----------------------------------------------------------------
import { muiQuery, useAppState } from "../context";

const VideoArchive = ({ state, actions, libraries }) => {
  const [postData, setPostData] = useState(null);
  const [heroBannerBlock, setHeroBannerBlock] = useState(null);
  // const [showMyVids, setShowMyVids] = useState(false);

  const { isActiveUser } = useAppState();

  const { sm, md, lg, xl } = muiQuery();

  const searchFilterRef = useRef("");
  const specialtyFilter = useRef("");
  const paidFilter = useRef("");
  const gradeFilter = useRef("");
  const showOnlyMyVids = useRef(false);
  const marginVertical = state.theme.marginVertical;

  const handleFilters = () => {
    let unfilteredVideos = Object.values(state.source.videos);

    if (specialtyFilter.current === "all") {
      setPostData(unfilteredVideos);
      return true;
    }
    if (paidFilter.current === "all") {
      setPostData(unfilteredVideos);
      return true;
    }

    const filteredVideos = unfilteredVideos.filter((video) => {
      if (
        specialtyFilter.current &&
        !video.event_specialty.includes(Number(specialtyFilter.current))
      )
        return false;
      if (
        gradeFilter.current &&
        !video.event_grade.includes(Number(gradeFilter.current))
      )
        return false;
      if (paidFilter.current) {
        if (paidFilter.current === "paid") return video.acf.private === true;
        if (paidFilter.current === "free")
          return video.acf.private === !video.acf.private;
      }
      return true;
    });

    setPostData(filteredVideos);
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
            value={specialtyFilter.current}
            onChange={() => {
              const select = document.getElementById("specialty-filters");
              const value = select.options[select.selectedIndex].value;
              specialtyFilter.current = value;
              handleFilters();
            }}
            style={!lg ? styles.dropdown : styles.dropdownMobile}
          >
            <option value="">Specialties</option>
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
      if (!state.source.event_grade) return null;
      const data = Object.values(state.source.event_grade);

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
            value={paidFilter.current}
            onChange={() => {
              const select = document.getElementById("payments-filters");
              const value = select.options[select.selectedIndex].value;
              paidFilter.current = value;
              handleFilters();
            }}
            style={!lg ? styles.dropdown : styles.dropdownMobile}
          >
            <option>Video type</option>
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
            specialtyFilter.current = null;
            paidFilter.current = null;
            gradeFilter.current = null;
            handleFilters();
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
        "There are no videos found"
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

  useEffect(() => {
    const fetchContent = async () => {
      actions.source.fetch("/videos/");
      actions.source.fetch("/event_specialty/");
    };
    const fetchHeroBanner = async () => {
      const fetchInfo = await fetch(
        state.source.url + "/wp-json/wp/v2/pages/7051"
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
          disable_vertical_padding: true,
        });
      }
    };

    const fetchUserVideos = async () => {
      const cookie = handleGetCookie({ name: `BAD-WebApp` });
      const { contactid, jwt } = cookie;

      const allVidz = state.source.videos;
      console.log("All videos", allVidz);
      const listOfVids = await fetch(
        state.auth.APP_HOST +
          "/videvent/e170d1fc-a0b9-ec11-983f-002248813da3/entities",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const json = await listOfVids.json();

      console.log("List of vids", json);
    };
    const data = state.source.get(state.router.link);
    setPostData(data.items);
    fetchContent();
    fetchHeroBanner();

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
          <div style={!lg ? styles.container : styles.containerMobile}>
            {postData.length > 0 ? (
              postData.map((item, key) => {
                const post = state.source[item.type][item.id];

                return <VideoArchivePost key={key} post={post} />;
              })
            ) : (
              <ServeNoVideosFound key={key} />
            )}
          </div>
        ) : (
          <ServeNoVideosFound key={key} />
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
