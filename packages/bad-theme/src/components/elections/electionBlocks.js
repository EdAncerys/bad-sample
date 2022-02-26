import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import Card from "../card/card";
import TitleBlock from "../titleBlock";
import Loading from "../loading";
import { colors } from "../../config/imports";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ElectionModal from "./electionModal";

const ElectionBlocks = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const {
    text_align,
    has_search,
    opened_or_closed_filter,
    positions_filter,
    title,
    disable_vertical_padding,
  } = block;

  const [electionList, setElectionList] = useState(null);
  const [gradeList, setGradeList] = useState(null); // data
  const [roleList, setRoleList] = useState(null); // data
  const [modalData, setModalData] = useState(null);
  const mountedRef = useRef(true);

  const [searchFilter, setSearchFilter] = useState(null);
  const [gradeFilter, setGradeFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [openPositions, serOpenPositions] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isSearch = has_search;
  const isPosition = positions_filter;
  const isOpen = opened_or_closed_filter;
  const ctaHeight = 45;

  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique uniqueId
    setUniqueId(blockId);
  }, []);

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/elections/`;
    await actions.source.fetch(path); // fetch CPT electionData

    const electionData = state.source.get(path);
    const { totalPages, page, next } = electionData; // check if electionData have multiple pages
    // fetch electionData via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const ELECTION_LIST = Object.values(state.source.elections); // add electionData object to data array
    setElectionList(ELECTION_LIST);
    // get taxonomy data for elections
    const GRADES = Object.values(state.source.election_grade);
    const ROLES = Object.values(state.source.election_roles);

    setGradeList(GRADES);
    setRoleList(ROLES);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!electionList) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document.querySelector(`#searchInput${uniqueId}`).value;

    const serveGradeFilter = document.querySelector(
      `#serveGradeFilter${uniqueId}`
    ).value;
    const serveRoleFilter = document.querySelector(
      `#serveRoleFilter${uniqueId}`
    ).value;
    const serveDateFilter = document.querySelector(
      `#serveDateFilter${uniqueId}`
    ).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveGradeFilter) setGradeFilter(serveGradeFilter);
    if (!!serveRoleFilter) setRoleFilter(serveRoleFilter);
    if (!!serveDateFilter) {
      setDateFilter(serveDateFilter);
      // apply date filter
      let filter = electionList.sort(
        (a, b) => new Date(a.acf.closing_date) - new Date(b.acf.closing_date)
      );
      if (serveDateFilter === "Date Descending") {
        filter = electionList.sort(
          (a, b) => new Date(b.acf.closing_date) - new Date(a.acf.closing_date)
        );
      }
      setElectionList(filter);
    }
  };

  const handleElectionModal = ({ block }) => {
    setModalData(block);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!isSearch) return null;

    const ServeSearchContainer = () => {
      return (
        <div className="flex-row">
          <div
            className="flex"
            style={{
              flex: 1,
              height: ctaHeight,
              position: "relative",
              margin: "auto 0",
            }}
          >
            <input
              id={`searchInput${uniqueId}`}
              type="text"
              className="form-control"
              placeholder="Find An Event"
              style={styles.input}
            />
            <div
              className="input-group-text toggle-icon-color"
              style={{
                position: "absolute",
                right: 0,
                height: ctaHeight,
                border: "none",
                background: "transparent",
                alignItems: "center",
                color: colors.darkSilver,
                cursor: "pointer",
              }}
            >
              <SearchIcon />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              paddingLeft: `2em`,
            }}
          >
            <button
              type="submit"
              className="blue-btn"
              onClick={handleInputSearch}
            >
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeFilters = () => {
      if (!gradeList && !roleList) return null; // props for filter options
      if (!isPosition) return null;

      const ServeTitle = () => {
        return (
          <div
            className="primary-title"
            style={{ fontSize: 20, paddingRight: `2em` }}
          >
            Filter:
          </div>
        );
      };

      const ServeFilterOne = () => {
        if (!gradeList) return null;

        return (
          <div className="flex" style={{ paddingRight: `1em` }}>
            <Form.Select
              id={`serveGradeFilter${uniqueId}`}
              style={styles.input}
            >
              <option value="null" hidden>
                Election Grades
              </option>
              {gradeList.map((item, key) => {
                return (
                  <option key={key} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        );
      };

      const ServeFilterTwo = () => {
        if (!roleList) return null;

        return (
          <div className="flex" style={{ paddingRight: `1em` }}>
            <Form.Select id={`serveRoleFilter${uniqueId}`} style={styles.input}>
              <option value="null" hidden>
                Election Role
              </option>
              {roleList.map((item, key) => {
                return (
                  <option key={key} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        );
      };

      const ServeDateFilter = () => {
        return (
          <div className="flex">
            <Form.Select id={`serveDateFilter${uniqueId}`} style={styles.input}>
              <option value="null" hidden>
                Sort By
              </option>
              <option value="Date Descending">Date Descending</option>
              <option value="Date Ascending">Date Ascending</option>
            </Form.Select>
          </div>
        );
      };

      return (
        <div
          className="flex"
          style={{ padding: `1em 0`, alignItems: "center" }}
        >
          <ServeTitle />
          <ServeFilterOne />
          <ServeFilterTwo />
          <ServeDateFilter />
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={() => setSearchFilter(null)}>
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

    const ServeDropDownGradeFilter = () => {
      if (!gradeFilter) return null;
      const GRADES = Object.values(state.source.election_grade);
      const filter = GRADES.filter((item) => item.id === Number(gradeFilter));
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setGradeFilter(null)}>
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

    const ServeDropDownRoleFilter = () => {
      if (!roleFilter) return null;
      const ROLES = Object.values(state.source.election_roles);
      const filter = ROLES.filter((item) => item.id === Number(roleFilter));
      const name = filter[0].name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div className="filter-icon" onClick={() => setRoleFilter(null)}>
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

    const ServeBtnFilter = () => {
      if (!openPositions) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>Open Positions</div>
          <div className="filter-icon" onClick={() => serOpenPositions(null)}>
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

    const ServeDropDownFilterFour = () => {
      if (!dateFilter) return null;

      return (
        <div className="shadow filter">
          <div>{dateFilter}</div>
          <div
            className="filter-icon"
            onClick={() => {
              setDateFilter(null);
              const ELECTION_LIST = Object.values(state.source.elections); // add electionData object to data array
              setElectionList(ELECTION_LIST);
            }}
          >
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

    const ServeOpenPositionBtnFilter = () => {
      if (!isOpen || openPositions) return null;

      return (
        <div className="shadow filter">
          <div
            style={{
              color: colors.softBlack,
              fontWeight: "bold",
              textTransform: "uppercase",
              padding: `1em 2em`,
              cursor: "pointer",
            }}
            onClick={() => serOpenPositions(!openPositions)}
          >
            Only Show Open Positions
          </div>
        </div>
      );
    };

    return (
      <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
        <div className="flex-col">
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeDropDownGradeFilter />
          <ServeDropDownRoleFilter />
          <ServeBtnFilter />
          <ServeDropDownFilterFour />
        </div>
        <div className="flex" style={{ marginTop: "1em" }}>
          <ServeOpenPositionBtnFilter />
        </div>
      </div>
    );
  };

  const ServeFooterActions = ({ isClosedPosition }) => {
    if (!isClosedPosition) return null;

    return (
      <div
        value="Notify me when position is open"
        className="caps-btn"
        style={{
          position: "absolute",
          bottom: 38,
          left: 32,
        }}
      >
        Notify me when position is open
      </div>
    );
  };

  if (!gradeList) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
      <ElectionModal modalData={modalData} setModalData={setModalData} />
      <TitleBlock block={{ title, text_align }} disableMargin />
      <ServeFilter />
      <div style={styles.container}>
        {electionList.map((block, key) => {
          const { title, election_grade, election_roles } = block;
          const { closing_date, cta, description, nomination_form_upload } =
            block.acf;

          // taxonomy grade name filtering
          const filter = gradeList.filter(
            (item) => item.id === Number(election_grade[0])
          );
          let GRADE_NAME = null;
          if (filter[0]) GRADE_NAME = filter[0].name;

          // elections closing date
          const today = new Date();
          const electionClosingDate = new Date(closing_date);
          const isClosedPosition = today > electionClosingDate;

          if (searchFilter) {
            if (
              !title.rendered
                .toLowerCase()
                .includes(searchFilter.toLowerCase()) &&
              !description.toLowerCase().includes(searchFilter.toLowerCase())
            )
              return null;
          }
          // select filtering config
          if (gradeFilter) {
            if (!election_grade.includes(Number(gradeFilter))) return null;
          }
          if (roleFilter) {
            if (!election_roles.includes(Number(roleFilter))) return null;
          }
          if (openPositions) {
            const date = new Date();
            const electionDate = new Date(closing_date);
            if (date >= electionDate) return null;
          }

          return (
            <div key={key} className="flex" style={{ position: "relative" }}>
              <div
                className="flex"
                // style={{ opacity: isClosedPosition ? 0.7 : 1 }}
              >
                <Card
                  cardTitle={GRADE_NAME}
                  title={title.rendered}
                  body={isClosedPosition ? null : description}
                  colour={colors.primary}
                  cardHeight="100%"
                  electionInfo={block}
                  link_label={
                    isClosedPosition ? "Notify me when position is open" : cta
                  }
                  handler={
                    isClosedPosition
                      ? () => console.log("Notify user")
                      : () => handleElectionModal({ block })
                  }
                  form_label="Nomination Form"
                  form_link={isClosedPosition ? null : nomination_form_upload}
                  cardMinHeight={370}
                  backgroundColor={
                    isClosedPosition ? colors.silverFillOne : null
                  }
                  opacity={isClosedPosition ? 0.7 : null}
                  shadow
                />
              </div>
              {/* <ServeFooterActions isClosedPosition={isClosedPosition} /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
};

export default connect(ElectionBlocks);
