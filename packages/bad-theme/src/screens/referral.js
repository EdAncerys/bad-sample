import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Loading from "../components/loading";

import { muiQuery } from "../context";
import TitleBlock from "../components/titleBlock";
import Card from "../components/card/card";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Referral = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const referral = state.source[data.type][data.id];
  console.log("🐞 REFERRAL", referral); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [position, setPosition] = useState(null);
  const [severity, setSeverity] = useState(null);

  useEffect(() => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);
  }, []);

  if (!referral || !position) return <Loading />;

  // HANDLERS --------------------------------------------

  // SERVERS ---------------------------------------------
  const ServeSeverityContainer = ({ block, type }) => {
    if (!block) return null;

    let description = block.filter((item) => item.title === "Description");
    if (description.length > 0) description = description[0].content;
    console.log("🐞 ", description); // debug

    return (
      <div onClick={() => console.log(type)}>
        <Card
          title={type}
          subTitle="Description:"
          body={description}
          colour={colors.primary}
          // bodyLimit={3} // limit body text
          cardMinHeight={250}
          shadow
        />
      </div>
    );
  };

  const ServeContent = () => {
    if (!severity) return null;

    return (
      <div
        className="text-body"
        style={{
          backgroundColor: colors.white,
          padding: `2em 0`,
        }}
      >
        <Html2React html={referral.acf.condition_description} />
      </div>
    );
  };

  const ServeDownloadAction = () => {
    if (!referral.acf && !referral.acf.clinical_resources) return null;

    const { clinical_resources } = referral.acf;

    const downloadAction = ({ link }) => {
      // 📌 open download link in new tab or window
      window.open(link, "_blank");
    };

    return (
      <div style={{ margin: `1em 0`, display: "flex", flexWrap: "wrap" }}>
        {clinical_resources.map((item, key) => {
          const { label, link } = item;

          return (
            <div
              key={key}
              className="caps-btn"
              onClick={() => downloadAction({ link })}
              style={{ paddingRight: "1em" }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        className="text-body"
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div
          className="flex-col shadow"
          style={{
            padding: `${marginVertical}px ${marginHorizontal}px`,
            margin: `${marginVertical}px 0`,
          }}
        >
          <div className="flex">
            <div
              className="flex primary-title"
              style={{ fontSize: !lg ? 36 : 25 }}
            >
              {referral.title ? referral.title.rendered : null}
            </div>
            {referral.acf && (
              <div className="referal-badge-container">
                <div className="referal-badge-wrapper">
                  {referral.acf.icd_search_category} disease code:
                  <span style={{ color: colors.blue, paddingLeft: 10 }}>
                    {referral.acf.icd11_code}
                  </span>
                </div>
              </div>
            )}
          </div>
          <ServeDownloadAction />
          <div className="flex-col">
            {referral.acf ? referral.acf.condition_description : null}
          </div>
        </div>

        <TitleBlock
          block={{
            text_align: "left",
            title: "Please Select Desease Severity:",
          }}
          fontSize={24}
          margin="1em 0"
        />
        <div className="severity-container">
          <ServeSeverityContainer
            block={referral.acf.severity_1_content}
            type={referral.acf.severity_1_name}
          />
          <ServeSeverityContainer
            block={referral.acf.severity_2_content}
            type={referral.acf.severity_2_name}
          />
          <ServeSeverityContainer
            block={referral.acf.severity_3_content}
            type={referral.acf.severity_3_name}
          />
        </div>
        <ServeContent />
      </div>
    </BlockWrapper>
  );
};

const styles = {
  link: { boxShadow: "none", color: "inherit" },
};

export default connect(Referral);
