import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import SearchDropDown from "../searchDropDown";
// --------------------------------------------------------------------------------
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

const AddressLookUplInput = ({
  form,
  name,
  labelClass,
  Label,
  onChange,
  handleSelectAddress,
  MaxLength,
  handleClearAddress,
  address1Line1Ref,
}) => {
  const ServeIcon = ({ data, fetching, onClick }) => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = data ? closeIcon : searchIcon;

    if (fetching)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={onClick}>{icon}</div>;
  };

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ErrorComponent name={name ?? ""} form={form} />

      <div style={{ position: "relative" }}>
        {!form.py3_address1ine1 && (
          <div style={{ position: "relative", width: "100%" }}>
            <div
              className="flex"
              style={{
                flex: 1,
                height: 40,
                position: "relative",
                margin: "auto 0",
              }}
            >
              <input
                ref={address1Line1Ref}
                onChange={onChange}
                maxLength={MaxLength}
                type="text"
                className="form-control input"
                placeholder={Label}
              />
              <div
                className="input-group-text toggle-icon-color"
                style={{
                  position: "absolute",
                  right: 0,
                  height: 40,
                  border: "none",
                  background: "transparent",
                  alignItems: "center",
                  color: colors.darkSilver,
                  cursor: "pointer",
                }}
              >
                <ServeIcon data={form.py3_address1ine1} />
              </div>
            </div>
            <SearchDropDown
              filter={form?.dev_address_data}
              onClickHandler={handleSelectAddress}
              height={250}
            />
          </div>
        )}
        {form.py3_address1ine1 && (
          <div className="form-control input">
            <div className="flex-row">
              <div
                style={{
                  position: "relative",
                  width: "fit-content",
                  paddingRight: 15,
                }}
              >
                {form.py3_address1ine1}
                <div
                  className="filter-icon"
                  style={{ top: -7 }}
                  onClick={handleClearAddress}
                >
                  <CloseIcon
                    style={{
                      fill: colors.darkSilver,
                      padding: 0,
                      width: "0.7em",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(AddressLookUplInput);
