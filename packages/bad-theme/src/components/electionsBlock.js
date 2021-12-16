import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import Card from "./card/card";
import TitleBlock from "./titleBlock";
import Loading from "./loading";
import { colors } from "../config/colors";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const ElectionsBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const [electionList, setElectionList] = useState(null);
  const [dropDownOne, setDropDownOne] = useState(null); // data
  const [dropDownTwo, setDropDownTwo] = useState(null); // data

  const [searchFilter, setSearchFilter] = useState(null);
  const [filterOne, setFilterOne] = useState(null);
  const [filterTwo, setFilterTwo] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const {
    text_align,
    has_search,
    opened_or_closed_filter,
    positions_filter,
    title,
  } = block;
  const isSearch = has_search;
  const isOpen = opened_or_closed_filter;
  const isPosition = positions_filter;
  const id = uuidv4();

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

    setDropDownOne(GRADES);
    setDropDownTwo(ROLES);
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!electionList) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;

    const serveFilterOne = document.querySelector(`#serveFilterOne${id}`).value;
    const serveFilterTwo = document.querySelector(`#serveFilterTwo${id}`).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveFilterOne) setFilterOne(serveFilterOne);
    if (!!serveFilterTwo) setFilterTwo(serveFilterTwo);
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
              marginRight: `2em`,
              padding: `0.75em 0`,
              position: "relative",
            }}
          >
            <input
              id={`searchInput${id}`}
              type="text"
              className="form-control"
              placeholder="Find An Event"
              style={styles.input}
            />
            <span
              className="input-group-text"
              style={{
                position: "absolute",
                right: 0,
                height: 45,
                border: "none",
                background: "transparent",
                alignItems: "center",
                color: colors.darkSilver,
              }}
            >
              <SearchIcon />
            </span>
          </div>
          <div style={{ display: "grid", alignItems: "center" }}>
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: colors.primary,
                color: colors.white,
                padding: `0.5em`,
              }}
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeFilters = () => {
      if (!dropDownOne && !dropDownTwo) return null; // props for filter options

      const ServeTitle = () => {
        return (
          <div
            style={{
              fontSize: 20,
              color: colors.black,
              padding: `0 2em`,
            }}
          >
            Filter:
          </div>
        );
      };

      const ServeFilterOne = () => {
        if (!dropDownOne) return null;

        return (
          <div className="flex" style={{ paddingRight: `1em` }}>
            <Form.Select
              id={`serveFilterOne${id}`}
              aria-label="Default select example"
              style={styles.input}
            >
              <option value="">Election Grades</option>
              {dropDownOne.map((item, key) => {
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
        if (!dropDownTwo) return null;

        return (
          <div className="flex">
            <Form.Select
              id={`serveFilterTwo${id}`}
              aria-label="Default select example"
              style={styles.input}
            >
              <option value="">Election Role</option>
              {dropDownTwo.map((item, key) => {
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

      return (
        <div
          className="flex"
          style={{ padding: `1em 0`, alignItems: "center" }}
        >
          <ServeTitle />
          <ServeFilterOne />
          <ServeFilterTwo />
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{searchFilter}</div>
          <div style={styles.closeAction} onClick={() => setSearchFilter(null)}>
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

    const ServeDropDownFilterOne = () => {
      if (!filterOne) return null;
      const GRADES = Object.values(state.source.election_grade);
      const filter = GRADES.filter((item) => item.id === Number(filterOne));
      const name = filter[0].name;

      return (
        <div className="shadow" style={styles.action}>
          <div>{name}</div>
          <div style={styles.closeAction} onClick={() => setFilterOne(null)}>
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

    const ServeDropDownFilterTwo = () => {
      if (!filterTwo) return null;
      const ROLES = Object.values(state.source.election_roles);
      const filter = ROLES.filter((item) => item.id === Number(filterTwo));
      const name = filter[0].name;

      return (
        <div className="shadow" style={styles.action}>
          <div>{name}</div>
          <div style={styles.closeAction} onClick={() => setFilterTwo(null)}>
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
      return (
        <div className="shadow" style={styles.action}>
          <div
            style={{
              color: colors.black,
              fontWeight: "bold",
              textTransform: "uppercase",
              padding: `1em 2em`,
              cursor: "pointer",
            }}
            // onClick={() => setFilterTwo(null)}
          >
            Only Show Open Positions
          </div>
        </div>
      );
    };

    return (
      <div style={{ position: "relative", paddingBottom: `1em` }}>
        <div className="flex-row">
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeDropDownFilterOne />
          <ServeDropDownFilterTwo />
        </div>
        <div className="flex" style={{ marginTop: "1em" }}>
          <ServeBtnFilter />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px ${marginHorizontal}px`,
        backgroundColor: colors.silverFillOne,
      }}
    >
      <TitleBlock block={{ title, text_align }} disableMargin />
      <ServeFilter />
      <div style={styles.container}>
        {electionList.map((block, key) => {
          const { title } = block;
          const {
            closing_date,
            cta,
            colour,
            description,
            nomination_form_upload,
          } = block.acf;
          console.log("data----", block);

          return (
            <div key={key}>
              <Card
                cardTitle="Officers Of The BAD"
                title={title.rendered}
                body={description}
                form_label={cta}
                form_link={nomination_form_upload}
                colour={colour}
                limitBodyLength
                cardHeight="100%"
              />
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
    color: colors.darkSilver,
  },
  action: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
  closeAction: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(ElectionsBlock);
