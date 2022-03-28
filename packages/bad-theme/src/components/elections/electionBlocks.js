import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import Card from "../card/card";
import TitleBlock from "../titleBlock";
import Loading from "../loading";
import { colors } from "../../config/imports";
import { muiQuery } from "../../context";

import SearchContainer from "../searchContainer";
import CloseIcon from "@mui/icons-material/Close";
import ElectionModal from "./electionModal";
// CONTEXT ------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../../context";

const ElectionBlocks = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { sm, md, lg, xl } = muiQuery();
  const dispatch = useAppDispatch();
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
  const searchFilterRef = useRef("");
  const mountedRef = useRef(true);

  const [searchFilter, setSearchFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [openPositions, setOpenPositions] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isSearch = has_search;
  const isPosition = positions_filter;
  const isOpen = opened_or_closed_filter;

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

    const electionList = Object.values(state.source.elections); // add electionData object to data array
    setElectionList(electionList);
    // get taxonomy data for elections
    const electionGrade = Object.values(state.source.election_grade);
    const electionRoles = Object.values(state.source.election_roles);

    setGradeList(electionGrade);
    setRoleList(electionRoles);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!electionList) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const dateFilterHandler = (e) => {
    const { value } = e.target;
    // date filter for elections
    if (value === "Date Ascending") {
      const sortedList = electionList.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setElectionList(sortedList);
    }
    if (value === "Date Descending") {
      const sortedList = electionList.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setElectionList(sortedList);
    }

    setDateFilter(value);
  };

  const handleContactForm = ({ isClosedPosition, block }) => {
    const {
      contact_public_email,
      contact_public_phone_number,
      contact_form_title,
      contact_form_body,
      contact_full_name,
      contact_email,
      contact_phone_number,
      contact_subject,
      contact_subject_dropdown_options,
      contact_message,
      contact_allow_attachments,
      contact_recipients,
    } = block.acf;

    let positionName = "Position";
    if (block.title.rendered) positionName = block.title.rendered;

    if (isClosedPosition)
      setEnquireAction({
        dispatch,
        enquireAction: {
          contact_public_email: contact_public_email || "harriet@bag.org.uk",
          contact_public_phone_number,
          form_title: contact_form_title || "Notification Form",
          form_body:
            contact_form_body ||
            `Notify when ${positionName} position is open.`,
          full_name: contact_full_name || true,
          email_address: contact_email || true,
          phone_number: contact_phone_number || true,
          subject: contact_subject || true,
          subject_dropdown_options: contact_subject_dropdown_options,
          message: contact_message || true,
          allow_attachments: contact_allow_attachments,
          recipients:
            contact_recipients || state.contactList.defaultContactList,
          // default email subject & template name
          emailSubject: `Notify when ${positionName} position is open.`,
          emailTemplate: "StandardEnquiryForm",
        },
      });
    if (!isClosedPosition) handleElectionModal({ block });
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value;
    setSearchFilter(input);
  };

  const handleElectionModal = ({ block }) => {
    setModalData(block);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!isSearch) return null;

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

      const ServeGradeFilter = () => {
        if (!gradeList) return null;

        return (
          <div className="flex" style={{ paddingRight: `1em` }}>
            <Form.Select
              style={styles.input}
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
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

      const ServeRoleFilter = () => {
        if (!roleList) return null;

        return (
          <div className="flex" style={{ paddingRight: `1em` }}>
            <Form.Select
              style={styles.input}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
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
            <Form.Select
              style={styles.input}
              value={dateFilter}
              onChange={dateFilterHandler}
            >
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
          <ServeGradeFilter />
          <ServeRoleFilter />
          <ServeDateFilter />
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={() => setSearchFilter("")}>
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
          <div className="filter-icon" onClick={() => setGradeFilter("")}>
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
          <div className="filter-icon" onClick={() => setRoleFilter("")}>
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

    const ServeOpenPositionsFilter = () => {
      if (!openPositions) return null;

      return (
        <div className="shadow filter">
          <div>{openPositions}</div>
          <div className="filter-icon" onClick={() => setOpenPositions(false)}>
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
          <div className="filter-icon" onClick={() => setDateFilter("")}>
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
            onClick={() => setOpenPositions("Open Positions")}
          >
            Only Show Open Positions
          </div>
        </div>
      );
    };

    const ServeFilterValues = () => {
      if (
        !searchFilter &&
        !gradeFilter &&
        !roleFilter &&
        !openPositions &&
        !dateFilter
      )
        return null;

      return (
        <div
          className="flex"
          style={{ margin: "0.5em 0", position: "relative" }}
        >
          <ServeSearchFilter />
          <ServeDropDownGradeFilter />
          <ServeDropDownRoleFilter />
          <ServeOpenPositionsFilter />
          <ServeDropDownFilterFour />
        </div>
      );
    };

    return (
      <div style={{ position: "relative" }} className="no-selector">
        <div className="flex-col" style={{ width: "70%" }}>
          <SearchContainer
            searchFilterRef={searchFilterRef}
            handleSearch={handleSearch}
          />
          <ServeFilters />
        </div>
        <ServeFilterValues />
        <div className="flex" style={{ margin: "1em 0 2em 0" }}>
          <ServeOpenPositionBtnFilter />
        </div>
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
      <div style={!lg ? styles.container : styles.containerMobile}>
        {electionList.map((block, key) => {
          const { title, election_grade, election_roles } = block;
          const { cta, description, nomination_form_upload, election_status } =
            block.acf;
          // console.log("block", block); // debug

          // taxonomy grade name filtering
          const filter = gradeList.filter(
            (item) => item.id === Number(election_grade[0])
          );
          let GRADE_NAME = null;
          if (filter[0]) GRADE_NAME = filter[0].name;

          // elections closing date condition
          const isClosedPosition = election_status === "closed";

          if (searchFilter) {
            if (
              !title.rendered.toLowerCase().includes(searchFilter) ||
              !description.toLowerCase().includes(searchFilter)
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
            if (election_status !== "open") return null;
          }

          return (
            <div key={key} className="flex" style={{ position: "relative" }}>
              <div className="flex">
                <Card
                  cardTitle={GRADE_NAME}
                  title={title.rendered}
                  body={isClosedPosition ? null : description}
                  colour={colors.primary}
                  electionInfo={block}
                  link_label={
                    isClosedPosition ? "Notify me when position is open" : cta
                  }
                  handler={() => handleContactForm({ isClosedPosition, block })}
                  // form_label="Nomination Form"
                  // form_link={isClosedPosition ? null : nomination_form_upload}
                  downloadFile={
                    !isClosedPosition
                      ? {
                          file: {
                            url: nomination_form_upload,
                            subtype: nomination_form_upload.split(".")[1],
                            title: "Nomination Form",
                          },
                        }
                      : null
                  }
                  cardMinHeight={370}
                  backgroundColor={
                    isClosedPosition ? colors.silverFillOne : null
                  }
                  opacity={isClosedPosition ? 0.7 : null}
                  bodyLimit={4}
                  shadow
                />
              </div>
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    gap: 0,
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
};

export default connect(ElectionBlocks);
