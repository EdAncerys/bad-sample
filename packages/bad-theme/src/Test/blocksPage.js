import React, { useEffect, useState, useRef } from "react";
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
  const [app, setApp] = useState(null);
  const [appStore, setAppStore] = useState(null);
  const inputCounter = useRef(0);

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

        console.log("🐞 app", bad_categorytype, bad_organisedfor);

        // map threough wpAppStore and find the app type that matches the user app type
        const wpAppType = wpAppStore.find((app) => {
          // get application & strip all white spaces and make lowercase and replace - with ''
          const application = app?.slug
            ?.toLowerCase()
            ?.replace(/\s/g, "")
            ?.replace(/-/g, "");

          // return memberships that matches or includes any words in applicationType
          return application?.includes(bad_categorytype);
        });

        console.log("wpAppType: ", wpAppType);
        setApp(userApp);
        setAppStore(wpAppStore);
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }, [isActiveUser]);

  // --------------------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --------------------------------------------------------------------------------
  // 📌  Extract data from user application blob
  // --------------------------------------------------------------------------------
  // let blob = {};
  // app?.map((app) => {
  //   blob = {
  //     ...blob,
  //     [app.name]: {
  //       type: "text",
  //       Label: app?.info?.Label || "Input Lapbel",
  //       AttributeType: app?.info?.AttributeType || "String",
  //       MaxLength: app?.info?.MaxLength || 100,
  //       Required: app?.info?.Required || "None",
  //     },
  //   };
  //   // console.log("🐞 ", app);
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
          console.log("🐞 Totla inputs rendered: ", inputCounter.current);
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

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <FomShowButton />

        {app?.map(({ info, name, value, Label, cargo }, key) => {
          if (cargo) return null; // skip cargo blob

          Label = Label || info?.Label || FORM_CONFIG?.[name]?.Label;
          const AttributeType =
            info?.AttributeType || FORM_CONFIG?.[name]?.AttributeType;
          const MaxLength = info?.MaxLength || FORM_CONFIG?.[name]?.MaxLength;
          const Required = info?.Required || FORM_CONFIG?.[name]?.Required;
          const Choices = info?.Choices || [];

          const labelClass =
            Required === "None" ? "form-label" : "form-label required";

          if (AttributeType === "String") {
            inputCounter.current++;

            return (
              <div key={key}>
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

          if (AttributeType === "Picklist") {
            inputCounter.current++;

            return (
              <div key={key}>
                <label className="form-label required">{Label}</label>
                <Form.Select
                  name="bad_categorytype"
                  value={form[name] || value}
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
