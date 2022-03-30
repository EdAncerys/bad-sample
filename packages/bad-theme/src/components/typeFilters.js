import { connect } from "frontity";
import { muiQuery } from "../context";
import { colors } from "../config/imports";

import { Dropdown } from "react-bootstrap";

const TypeFilters = ({
  state,
  actions,
  libraries,
  filters,
  typeFilterRef,
  title,
  handleSearch,
  handleClearTypeFilter,
  currentFilter,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  if (!filters) return null;

  // HELPERS ----------------------------------------------------------------
  const handleSetTypeFilter = ({ id }) => {
    typeFilterRef.current = id;
    handleSearch();
  };

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: 20,
          alignItems: "center",
        }}
      >
        {title}
      </div>
    );
  };

  const ServeAllFilter = () => {
    if (!handleClearTypeFilter) return null;

    return (
      <div
        className="shadow filter-action"
        onClick={handleClearTypeFilter}
        style={{
          backgroundColor:
            typeFilterRef.current === null ? colors.primary : colors.white,
          color:
            typeFilterRef.current === null ? colors.white : colors.softBlack,
        }}
      >
        <Html2React html={"All"} />
      </div>
    );
  };

  const ServeFilter = () => {
    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <ServeAllFilter />

        {filters.map((type, key) => {
          return (
            <div
              key={key}
              className="shadow filter-action"
              onClick={() => handleSetTypeFilter({ id: type.id })}
              style={{
                backgroundColor:
                  typeFilterRef.current === type.id
                    ? colors.primary
                    : colors.white,
                color:
                  typeFilterRef.current === type.id
                    ? colors.white
                    : colors.softBlack,
              }}
            >
              <Html2React html={type.name} />
            </div>
          );
        })}
      </div>
    );
  };

  const ServeFilterMobile = () => {
    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <ServeAllFilter />

        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            style={{
              backgroundColor: colors.darkSilver,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 0,
              position: "relative",
              zIndex: 700,
              padding: "1em",
              border: 0,
            }}
            drop="down"
          >
            {currentFilter ? currentFilter : "Filters"}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: "100%" }}>
            {filters.map((type, key) => {
              return (
                <Dropdown.Item
                  onClick={() => handleSetTypeFilter({ id: type.id })}
                  drop="down"
                >
                  <Html2React html={type.name} />
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
  return (
    <div className="no-selector">
      <ServeTitle />
      {!lg ? <ServeFilter /> : <ServeFilterMobile />}
    </div>
  );
};

export default connect(TypeFilters);
