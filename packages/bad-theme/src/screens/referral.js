import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Loading from "../components/loading";

import { getReferralsData, muiQuery } from "../context";
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
  const ServeSeverityContainer = ({ description, name, status }) => {
    return (
      <div onClick={() => setSeverity(status)}>
        <Card
          title={name}
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

  const ServeContentCard = ({ title, body, recaurces, isRowItem }) => {
    if (!body) return null; // dont return component if no body

    let classList = "flex-col";
    if (isRowItem) classList = "flex";

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
            style={{
              fontSize: 20,
              paddingBottom: "1em",
              marginBottom: "0.5em",
            }}
          >
            <Html2React html={title} />
          </div>
        )}
        {body && (
          <div className={classList}>
            <Html2React html={body} />
          </div>
        )}
        {recaurces && <ServeDownloadAction recaurces={recaurces} />}
      </div>
    );
  };

  const ServeContent = () => {
    if (!severity) return null;

    let condition = referral.acf.severity_1_name;
    let management = referral.acf.severity_1_referral_management;
    let treatment = referral.acf.severity_1_treatment_therapy;
    let teledermatology = referral.acf.severity_1_teledermatology;
    let tips = referral.acf.clinical_tips;

    // contitional rendering based on type of referral
    if (severity === "moderate") {
      condition = referral.acf.severity_2_name;
      management = referral.acf.severity_2_referral_management;
      treatment = referral.acf.severity_2_treatment_therapy;
      teledermatology = referral.acf.severity_2_teledermatology;
    }
    if (severity === "severe") {
      condition = referral.acf.severity_3_name;
      management = referral.acf.severity_3_referral_management;
      treatment = referral.acf.severity_3_treatment_therapy;
      teledermatology = referral.acf.severity_3_teledermatology;
    }

    return (
      <div className="flex-col">
        {management && (
          <div
            className="flex-col shadow"
            style={{
              padding: `${marginVertical}px ${marginHorizontal}px`,
              marginTop: `${marginVertical}px`,
              backgroundColor: colors.primary,
              color: colors.white,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Html2React
                html={`Referral Management for ${condition} - ${referral.title.rendered}:`}
              />
            </div>
            <div>
              <Html2React html={management} />
            </div>
          </div>
        )}

        <ServeContentCard title="Teledermatology" body={teledermatology} />
        <ServeContentCard
          title="Clinical Recaurces"
          recaurces={referral.acf.clinical_resources}
        />
        <ServeContentCard title="Clinical Tips" body={tips} />
        <ServeContentCard title="Referal Management" body={management} />
        <ServeContentCard title="Treatment" body={treatment} />
        <ServeContentCard
          title="Patient Information Leaflets"
          recaurces={referral.acf.patient_information_resources}
        />
        <ServeContentCard
          title="ICD search category(s)"
          body={`${referral.acf.icd_search_category} <span class="referal-badge-wrapper">ICD11 CODE  <span style="color: #3882CD; padding-left: 10px;">${referral.acf.icd11_code}</span></span>`}
          isRowItem
        />
      </div>
    );
  };

  const ServeDownloadAction = ({ recaurces, isRowItem }) => {
    if (!recaurces) return null;

    const downloadAction = ({ link }) => {
      // 📌 open download link in new tab or window
      window.open(link, "_blank");
    };

    let classList = "flex-col";
    if (isRowItem) classList = "flex-row";

    return (
      <div className={classList} style={{ marginTop: `1em` }}>
        {recaurces.map((item, key) => {
          const { label, link } = item;

          return (
            <div
              key={key}
              className="caps-btn"
              style={{ padding: "10px 10px 0 0" }}
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
              {referral.title ? (
                <Html2React html={referral.title.rendered} />
              ) : null}
            </div>
            {referral.acf && (
              <div className="referal-badge-container">
                <div className="referal-badge-wrapper">
                  <Html2React html={referral.acf.icd_search_category} /> disease
                  code:
                  <span style={{ color: colors.blue, paddingLeft: 10 }}>
                    <Html2React html={referral.acf.icd11_code} />
                  </span>
                </div>
              </div>
            )}
          </div>

          <ServeDownloadAction
            recaurces={referral.acf.condition_guideline_link}
            isRowItem
          />

          <div className="flex-col">
            <Html2React html={referral.acf.condition_description} />
          </div>
          {referral.acf.severity_notice && (
            <div
              className="flex-col primary-title"
              style={{ marginTop: "1em" }}
            >
              <Html2React html={referral.acf.severity_notice} />
            </div>
          )}
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
            description={referral.acf.severity_1_description}
            name={referral.acf.severity_1_name}
            status="mild"
          />
          <ServeSeverityContainer
            description={referral.acf.severity_2_description}
            name={referral.acf.severity_2_name}
            status="moderate"
          />
          <ServeSeverityContainer
            description={referral.acf.severity_3_description}
            name={referral.acf.severity_3_name}
            status="severe"
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
