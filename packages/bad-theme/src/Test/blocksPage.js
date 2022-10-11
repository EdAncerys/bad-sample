import React, { useEffect, useState } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
// --------------------------------------------------------------------------------
import {
  Parcer,
  getMembershipTypes,
  useAppState,
  getUserStoreAction,
  FORM_CONFIG,
} from "../context";
// --------------------------------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
import { Form } from "react-bootstrap";

const BlocksPage = ({ state, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  const { applicationData, isActiveUser } = useAppState();

  const [form, setForm] = useState({});
  const [appBlob, setAppBlob] = useState(null);
  const [appTypes, setAppTypes] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

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

        console.log("appTypes: ", appTypes);
        setAppBlob(userApp);
        setAppTypes(appTypes);
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
        }}
      >
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

          if (cargo) return null; // skip cargo blob

          Label = Label || info?.Label || FORM_CONFIG?.[name]?.Label;
          const AttributeType =
            info?.AttributeType || FORM_CONFIG?.[name]?.AttributeType;
          const MaxLength = info?.MaxLength || FORM_CONFIG?.[name]?.MaxLength;
          const Required = info?.Required || FORM_CONFIG?.[name]?.Required;
          const Choices = info?.Choices || FORM_CONFIG?.[name]?.Choices || [];
          const Handler = FORM_CONFIG?.[name]?.Handler || null;

          const labelClass =
            Required === "None" ? "form-label" : "form-label required";

          if (AttributeType === "String") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <label className={labelClass}>{Label}</label>
                <input
                  name={name}
                  value={form[name] || value || ""}
                  onChange={handleInputChange}
                  type="text"
                  maxLength={MaxLength}
                  placeholder={Label}
                  className="form-control input"
                />
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

          if (AttributeType === "Picklist" || AttributeType === "Memo") {
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
