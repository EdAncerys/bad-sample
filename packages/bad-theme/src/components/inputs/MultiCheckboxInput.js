import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG, colors } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Caption from "./Caption";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MultiCheckboxInput = ({
  state,
  form,
  name,
  Label,
  labelClass,
  Choices,
  multiSelectHandler,
  multiSelectDropDownHandler,
  // 👉 dashboard widget
  dashboardWidget,
}) => {
  const hasSelection = form?.[name] !== undefined && form?.[name].length > 0;
  let userSelection =
    form?.["dev_multi_select_" + name] || form?.[dashboardWidget];
  // if userSelection starts with a comma, remove it
  if (userSelection?.startsWith(",")) {
    userSelection = userSelection.substring(1);
  }

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      {Label && <label className={labelClass}>{Label}</label>}
      <ErrorComponent name={name ?? ""} form={form} />

      <div
        className="form-control input"
        onClick={() => multiSelectDropDownHandler({ name })}
      >
        <div className="flex-row">
          <div
            style={{
              position: "relative",
              width: "fit-content",
              paddingRight: 15,
              color: !hasSelection ? colors.darkSilver : "inherit",
              width: "99%",
            }}
          >
            {userSelection || Label || "Select"}
            <div className="filter-icon" style={{ top: 0 }}>
              <KeyboardArrowDownIcon
                style={{
                  fill: colors.darkSilver,
                  padding: 0,
                  width: 25,
                  height: 25,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {form?.["dev_selected_" + name] && (
        <div
          className="input"
          style={{
            position: "absolute",
            zIndex: 100,
            left: 0,
            right: 0,
            marginTop: 10,
            border: `1px solid ${colors.silver}`,
            backgroundColor: colors.white,
          }}
        >
          <div className="flex">
            <div
              className="flex-col"
              style={{
                minHeight: 45,
                maxHeight: state.theme.bannerHeight / 2,
                height: "auto",
                borderRadius: 10,
                padding: `0.5em 1em`,
                overflow: "auto",
              }}
            >
              {Choices.map((choice, key) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: form?.[name]?.includes(choice?.value)
                      ? colors.silver
                      : "#F0F1F4", // selected values background color
                    borderRadius: 10,
                    padding: "4px 16px",
                    margin: "4px 0",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    multiSelectHandler({
                      title: choice?.Label,
                      value: choice?.value,
                      name,
                    })
                  }
                >
                  {choice.Label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Caption caption={FORM_CONFIG?.[name]?.caption} />
    </div>
  );
};

export default connect(MultiCheckboxInput);
