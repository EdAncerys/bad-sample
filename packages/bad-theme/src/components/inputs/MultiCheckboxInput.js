import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG, colors } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Caption from "./Caption";
import SearchDropDown from "../searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MultiCheckboxInput = ({
  state,
  form,
  name,
  Label,
  value,
  labelClass,
  onChange,
  Choices,
}) => {
  const defaultValue = form[name] === undefined || "";
  console.log("⭐️ ", defaultValue, Choices);

  // selected values container
  const Selected = ({ title }) => {
    return (
      <div>
        {form?.[name]?.includes(title) && (
          <div
            className="flex items-center justify-between"
            style={{
              backgroundColor: colors.silver,
              borderRadius: 10,
              padding: "0.5em 1em",
              margin: "0.5em 0",
            }}
          >
            <div className="flex items-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.white,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <div>{title}</div>
                <CloseIcon
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    const newValues = form[name].filter((v) => v !== title);
                    onChange(name, newValues);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 👉 refactor data to match dropdown format

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ErrorComponent name={name ?? ""} form={form} />

      <div
        className="form-control input"
        onClick={() =>
          onChange({
            target: {
              name: "dev_selected" + name,
              value: !form?.["dev_selected" + name],
            },
          })
        }
      >
        <div className="flex-row">
          <div
            style={{
              position: "relative",
              width: "fit-content",
              paddingRight: 15,
              color: defaultValue ? colors.darkSilver : "inherit",
              width: "99%",
            }}
          >
            {Label}

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

      {form?.["dev_selected" + name] && (
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
                    backgroundColor: "#a2a2a2", // colors.silver,
                    borderRadius: 10,
                    padding: "4px 16px",
                    margin: "4px 0",
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("⭐️ ", choice?.value)}
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
