import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
// --------------------------------------------------------------------------------
import {
  Parcer,
  getMembershipTypes,
  useAppState,
  useAppDispatch,
  getUserStoreAction,
  FORM_CONFIG,
  getHospitalsAction,
  colors,
  getHospitalNameAction,
  sendFileToS3Action,
} from "../context";
// --------------------------------------------------------------------------------
import SearchDropDown from "../components/searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";
import ActionPlaceholder from "../components/actionPlaceholder";

const BlocksPage = ({ state, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  const { applicationData, isActiveUser } = useAppState();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    hospital_lookup: "", // lookup input value
    hospital_name: "", // selected hospital name value
  });
  const [appBlob, setAppBlob] = useState(null);
  const [appTypes, setAppTypes] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const documentRef = useRef(null);

  // 📌 if env is dev, show the blocks.
  if (state.auth.ENVIRONMENT !== "DEV") return null;
  let title = [];

  useEffect(() => {
    if (!isActiveUser) return null; // async user data fetch from Dynamics. If no user break

    // async fetch handler
    (async () => {
      try {
        const wpAppStore = await getMembershipTypes({ state });
        const userApp = await getUserStoreAction({ state, isActiveUser });
        let hospitalId = "";
        let hospitalName = "";
        let documentUrl = "";

        // --------------------------------------------------------------------------------
        // 📌  Check if user have hospital id set in Dynamics. If not, set hospitalId to null
        //  Check for Doc URL in Dynamics. If not, set documentUrl to null
        // --------------------------------------------------------------------------------
        userApp.map((item) => {
          if (item.name === "py3_hospitalid" && item.value) {
            hospitalId = item.value;
          }
          if (item.name === "sky_cvurl" && item.value) {
            documentUrl = item.value;
          }
        });

        if (hospitalId) {
          const hospitalData = await getHospitalNameAction({
            state,
            dispatch,
            id: hospitalId,
          });
          if (hospitalData) hospitalName = hospitalData.name;
        }

        console.log("wpAppStore: ", wpAppStore);
        console.log("userApp: ", userApp);

        const bad_categorytype = userApp?.[0]?.bad_categorytype
          ?.toLowerCase()
          ?.replace(/\s/g, "");
        const bad_organisedfor = userApp?.[0]?.bad_organisedfor;

        console.log("🐞 appBlob", bad_categorytype, bad_organisedfor);

        // find all applications that match the user's category type
        const appTypes = wpAppStore.filter((appBlob) => {
          // get application & strip all white spaces and make lowercase and replace - with ''
          const application = appBlob?.slug
            ?.toLowerCase()
            ?.replace(/\s/g, "")
            ?.replace(/-/g, "");

          return application?.includes(bad_categorytype); // return memberships that matches or includes any words in applicationType
        });

        console.log("hospitalId: ", hospitalId);
        documentRef.current = documentUrl; // set documentRef to documentUrl
        setAppBlob(userApp);
        setAppTypes(appTypes);
        setForm({
          ...form,
          hospital_name: hospitalName,
          doc_file: documentUrl, // set documentUrl to form
        });
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }, [isActiveUser]);

  // --------------------------------------------------------------------------------
  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    console.log("🐞 name, value, type, checked", name, value, type, checked);

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectHospital = ({ item }) => {
    setForm((form) => ({
      ...form,
      hospital_lookup: "",
      hospital_name: item?.title,
      py3_hospitalid: item?.link,
    }));

    setHospitalData(null); // clear hospital data for dropdown
  };

  const handleClearHospital = () => {
    setForm((form) => ({
      ...form,
      hospital_name: "",
    }));
  };

  const handleDocUploadChange = async (e) => {
    let sky_cvurl = e.target.files[0];
    if (!sky_cvurl) return;

    try {
      setFetching(true);
      // upload file to S3 bucket and get url
      sky_cvurl = await sendFileToS3Action({
        state,
        dispatch,
        attachments: sky_cvurl,
      });

      setForm((prevFormData) => ({
        ...prevFormData,
        ["sky_cvurl"]: sky_cvurl,
        ["doc_file"]: "", // clear file input for prevevious uploads
      }));

      // console.log("🐞 ", sky_cvurl); // debug
    } catch (error) {
      // console.log("🤖 error", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  Hospital name lookup
    // --------------------------------------------------------------------------------

    // if hospital name is not empty, fetch hospital data
    if (form.hospital_name || form.hospital_lookup === "") return null;

    (async () => {
      try {
        console.log("🐞 py3_hospitalid", form.py3_hospitalid);
        let hospitalData = await getHospitalsAction({
          state,
          dispatch,
          input: form.hospital_lookup,
        });
        // refactor hospital data to match dropdown format
        hospitalData = hospitalData.map((hospital) => {
          return {
            title: hospital.name,
            link: hospital.accountid,
          };
        });
        setHospitalData(hospitalData);
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }, [form]);

  // --------------------------------------------------------------------------------
  // 📌  Extract data from user application blob
  // --------------------------------------------------------------------------------
  // let blob = {};
  // appBlob?.map((appBlob) => {
  //   blob = {
  //     ...blob,
  //     [appBlob.name]: {
  //       type: "text",
  //       Label: appBlob?.info?.Label || "Input Lapbel",
  //       AttributeType: appBlob?.info?.AttributeType || "String",
  //       MaxLength: appBlob?.info?.MaxLength || 100,
  //       Required: appBlob?.info?.Required || "None",
  //       order: 0,
  //     },
  //   };
  //   // console.log("🐞 ", appBlob);
  // });
  // console.log("🐞 blob", JSON.stringify(blob));

  const FomShowButton = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 16,
          background: "black",
          color: "white",
          borderRadius: 16,
          cursor: "pointer",
        }}
        onClick={() => {
          console.log("form: ", form);
        }}
      >
        Log Form
      </div>
    );
  };

  return (
    <div>
      <div className="flex-col" style={{ alignItems: "center" }}>
        <div className="flex primary-title">BLOCK BUILDER 😈</div>
        <div className="flex">
          <Parcer libraries={libraries} html={title} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <ActionPlaceholder
          isFetching={isFetching}
          background="transparent"
          alignSelf="self-end"
          padding="0 0 45% 0"
        />
        <FomShowButton />

        <div>
          <label className="form-label required">
            Please select the Special Interest Group you would like to apply
            for:
          </label>
          <Form.Select
            name="bad_categorytype"
            value={form.bad_categorytype || ""}
            onChange={handleInputChange}
            className="form-control input"
          >
            <option value="" hidden>
              Membership Category
            </option>
            {appTypes?.map(({ acf }, key) => {
              const category_types = acf?.category_types;
              // get SIG membership categories name from custom object
              // split string on : and swap first and second value
              // if typeName includes Full replace with empty string
              // change prefix for names with " - ", eg. "Tarainee - Time"
              let typeName = category_types.split(":").reverse().join(" - ");
              // if value include - Full replace with empty string
              typeName = typeName.replace(" - Full", "");

              return (
                <option key={key} value={category_types}>
                  {typeName}
                </option>
              );
            })}
          </Form.Select>
        </div>

        {appBlob?.map(({ info, name, value, Label, cargo }, key) => {
          // ⚠️ types handles the input type
          // String & Boolean & Picklist & DateTime & Memo
          // *Lookup (has variables)

          if (cargo) return null; // skip cargo blob
          if (name !== "sky_cvurl") return null; // testing

          Label = Label || info?.Label || FORM_CONFIG?.[name]?.Label;
          const AttributeType =
            info?.AttributeType || FORM_CONFIG?.[name]?.AttributeType;
          const MaxLength = info?.MaxLength || FORM_CONFIG?.[name]?.MaxLength;
          const Required = info?.Required || FORM_CONFIG?.[name]?.Required;
          const Choices = info?.Choices || FORM_CONFIG?.[name]?.Choices || [];
          const Handler = FORM_CONFIG?.[name]?.Handler || null;

          const labelClass =
            Required === "None" ? "form-label" : "form-label required";

          if (name === "sky_cvurl") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <label className={labelClass}>{Label}</label>
                <div style={{ position: "relative" }}>
                  {form.doc_file && (
                    <label
                      style={{
                        position: "absolute",
                        left: 120,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="caps-btn-no-underline"
                    >
                      CV exists in database
                    </label>
                  )}
                  <input
                    ref={documentRef}
                    onChange={handleDocUploadChange}
                    name={name}
                    type="file"
                    className="form-control input"
                    accept=".pdf,.doc,.docx"
                    style={{ color: form.doc_file ? "transparent" : "black" }}
                  />
                </div>
              </div>
            );
          }

          if (AttributeType === "String" || AttributeType === "Memo") {
            // TODO: py3_speciality to change to Picklist
            let disabled = false;
            if (name === "py3_email" && value) disabled = true; // disable email input if user has email
            if (name === "bad_currentpost" && value) disabled = true; // disable current post input if user has current post

            let type = "input";
            if (AttributeType === "Memo") type = "textarea";

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <label className={labelClass}>{Label}</label>
                {type === "input" && (
                  <input
                    name={name}
                    value={form[name] || value || ""}
                    onChange={handleInputChange}
                    type="text"
                    maxLength={MaxLength}
                    placeholder={Label}
                    className="form-control input"
                    disabled={disabled}
                  />
                )}
                {type === "textarea" && (
                  <textarea
                    name={name}
                    value={form[name] || value || ""}
                    onChange={handleInputChange}
                    type="text"
                    maxLength={MaxLength}
                    placeholder={Label}
                    className="form-control input"
                    disabled={disabled}
                  />
                )}

                {FORM_CONFIG?.[name]?.caption && (
                  <div style={{ margin: "0.5em 0" }}>
                    {FORM_CONFIG?.[name]?.caption}
                  </div>
                )}
              </div>
            );
          }

          if (AttributeType === "Lookup" && name === "py3_hospitalid") {
            // --------------------------------------------------------------------------------
            // 📌  Hospital lookup input with dropdown
            // --------------------------------------------------------------------------------
            let disabled = false;
            if (value) disabled = true; // disable hospital input if user has hospital

            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  position: "relative",
                }}
              >
                <label className={labelClass}>{Label}</label>
                {form.hospital_name && (
                  <div
                    className="form-control input"
                    style={{
                      backgroundColor: !disabled
                        ? "transparent"
                        : colors.disabled,
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
                        {form.hospital_name}
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
                {!form.hospital_name && (
                  <input
                    name="hospital_lookup" // hospital name not passed to form submit object
                    value={form.hospital_lookup}
                    onChange={handleInputChange}
                    type="text"
                    maxLength={MaxLength}
                    placeholder={Label}
                    className="form-control input"
                    disabled={disabled}
                  />
                )}
                {hospitalData && (
                  <SearchDropDown
                    filter={hospitalData}
                    onClickHandler={handleSelectHospital}
                    height={230}
                  />
                )}
              </div>
            );
          }

          if (AttributeType === "DateTime") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <label className={labelClass}>{Label}</label>
                <input
                  name={name}
                  value={form[name] || value || ""}
                  onChange={handleInputChange}
                  type="date"
                  maxLength={MaxLength}
                  placeholder={Label}
                  className="form-control input"
                />
              </div>
            );
          }

          if (AttributeType === "Boolean") {
            const labelClass = "caps-btn-no-underline";

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <div
                  className="flex"
                  style={{ alignItems: "center", margin: "1em 0" }}
                >
                  <input
                    name={name}
                    value={name}
                    checked={form[name] || value || false}
                    onChange={handleInputChange}
                    type="checkbox"
                    className="form-check-input check-box"
                  />
                  <div onClick={Handler} style={{ display: "flex" }}>
                    <label
                      className={labelClass}
                      style={{ cursor: Handler ? "pointer" : "default" }}
                    >
                      {Label}
                    </label>
                  </div>
                </div>
              </div>
            );
          }

          if (AttributeType === "Picklist") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <label className="form-label required">{Label}</label>
                <Form.Select
                  name={name}
                  value={form[name] || value || ""}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="" hidden>
                    {Label}
                  </option>
                  {Choices.map(({ value, Label }, key) => {
                    return (
                      <option key={key} value={value}>
                        {Label}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            );
          }

          return null; // return null if no match
        })}
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

export default connect(BlocksPage);
