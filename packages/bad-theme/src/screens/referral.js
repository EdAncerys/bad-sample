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

    let description = block[0].content;

    return (
      <div onClick={() => setSeverity(block)}>
        <Card
          title={type}
          subTitle="Description:"
          body={description}
          colour={colors.primary}
          bodyLimit={10} // limit body text
          cardMinHeight={250}
          shadow
        />
      </div>
    );
  };

  const ServeContentCard = ({ title, body, recaurces }) => {
    return (
      <div
        className="flex-col shadow"
        style={{
          padding: `${marginVertical}px 2em`,
          marginTop: `${marginVertical}px`,
        }}
      >
        {title && (
          <div
            className="flex primary-title divider"
            style={{ fontSize: 20, paddingBottom: "1em", marginBottom: "1em" }}
          >
            <Html2React html={title} />
          </div>
        )}
        {body && (
          <div className="flex">
            <Html2React html={body} />
          </div>
        )}
        {recaurces && <ServeDownloadAction recaurces={recaurces} />}
      </div>
    );
  };

  const ServeContent = () => {
    if (!severity) return null;

    let notice = referral.acf.severity_notice;
    let treatment = severity[1];
    let management = severity[2];

    return (
      <div className="flex-col">
        {notice && (
          <div
            className="flex-col shadow"
            style={{
              padding: `${marginVertical}px ${marginHorizontal}px`,
              marginTop: `${marginVertical}px`,
              backgroundColor: colors.primary,
              color: colors.white,
              textAlign: "center",
            }}
          >
            <Html2React html={referral.notice} />
          </div>
        )}

        <ServeContentCard title={treatment.title} body={treatment.content} />
        <ServeContentCard
          title="Clinical Recaurces"
          recaurces={referral.acf.clinical_resources}
        />
        <ServeContentCard title={management.title} body={management.content} />
        <ServeContentCard
          title="Patient Information Leaflets"
          recaurces={referral.acf.patient_information_resources}
        />
        <ServeContentCard
          title="ICD search category(s)"
          body={`${referral.acf.icd_search_category} <span class="referal-badge-wrapper">ICD11 CODE ${referral.acf.icd11_code}</span>`}
        />
      </div>
    );
  };

  const ServeDownloadAction = ({ recaurces }) => {
    const downloadAction = ({ link }) => {
      // 📌 open download link in new tab or window
      window.open(link, "_blank");
    };

    return (
      <div className="flex-col" style={{ margin: `1em 0` }}>
        {recaurces.map((item, key) => {
          const { label, link } = item;

          return (
            <div
              key={key}
              className="caps-btn"
              style={{ padding: "10px 0" }}
              onClick={() => downloadAction({ link })}
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

          <div className="caps-btn" style={{ padding: "1em 0" }}>
            DOWNLOAD RECAURCES
          </div>

          <div className="flex-col">
            {referral.acf ? referral.acf.condition_description : null}
          </div>
        </div>

        <TitleBlock
          block={{
            text_align: "left",
            title: "Please Select Desease Severity:",
          }}
          fontSize={20}
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
