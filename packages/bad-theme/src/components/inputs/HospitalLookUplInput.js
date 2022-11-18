import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG, colors } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import SearchDropDown from "../searchDropDown";
import Caption from "./Caption";
import CloseIcon from "@mui/icons-material/Close";

const HospitalLookUplInput = ({
  form,
  name,
  labelClass,
  Label,
  disabled,
  handleHospitalLookup,
  handleSelectHospital,
  MaxLength,
  handleClearHospital,
  hospitalSearchRef,
  onChange,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ErrorComponent name={name ?? ""} form={form} />

      {form?.sky_newhospitalname && (
        <div
          className="form-control input"
          style={{
            backgroundColor: !disabled ? "transparent" : colors.disabled,
          }}
        >
          <div className="flex-row">
            <div
              style={{
                position: "relative",
                width: "fit-content",
                paddingRight: 15,
              }}
            >
              {form?.sky_newhospitalname}
              {!disabled && (
                <div
                  className="filter-icon"
                  style={{ top: -5 }}
                  onClick={handleClearHospital}
                >
                  <CloseIcon
                    style={{
                      fill: colors.darkSilver,
                      padding: 0,
                      width: 15,
                      height: 15,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!form?.sky_newhospitalname && (
        <input
          ref={hospitalSearchRef}
          onChange={handleHospitalLookup}
          type="text"
          maxLength={MaxLength}
          placeholder={Label}
          className="form-control input"
          disabled={disabled}
        />
      )}
      {form?.dev_hospital_data && (
        <div className="relative">
          <SearchDropDown
            filter={form?.dev_hospital_data}
            onClickHandler={handleSelectHospital}
            height={230}
          />

          <div
            className="filter-icon"
            style={{
              top: 20,
              right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => {
              onChange({
                target: { name: "dev_hospital_data", value: undefined },
              });
            }}
          >
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
                width: 25,
                height: 25,
              }}
            />
          </div>
        </div>
      )}

      <Caption caption={FORM_CONFIG?.[name]?.caption} />
    </div>
  );
};

export default connect(HospitalLookUplInput);
