import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { colors } from "../config/imports";
import { Dropdown } from "react-bootstrap";
// --------------------------------------------------------------------------------
import { muiQuery, Parcer } from "../context";

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
  const { sm, md, lg, xl } = muiQuery();

  if (!filters) return null;

  // HELPERS ----------------------------------------------------------------
  const handleSetTypeFilter = ({ id }) => {
    typeFilterRef.current = id;
    handleSearch({ id });
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
        <Parcer libraries={libraries} html={"All"} />
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
              <Parcer libraries={libraries} html={type.name} />
            </div>
          );
        })}
      </div>
    );
  };

  const ServeFilterMobile = () => {
    return (
      <div
        className="flex"
        style={{ flexWrap: "wrap", alignItems: !lg ? null : "flex-end" }}
      >
        <ServeAllFilter />
        <Dropdown>
          <Dropdown.Toggle
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
              borderRadius: 5,
              padding: 20,
            }}
            dataDisplay="static"
          >
            {currentFilter ? currentFilter : "Filters"}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ margin: "10px 0", width: "100%" }}>
            {filters.map((type, key) => {
              return (
                <Dropdown.Item
                  key={key}
                  onClick={() => handleSetTypeFilter({ id: type.id })}
                  drop="down"
                >
                  <Parcer libraries={libraries} html={type.name} />
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
