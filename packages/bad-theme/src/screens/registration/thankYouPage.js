import { connect } from "frontity";

import Image from "@frontity/components/image";
import SideBarMenu from "./sideBarMenu";
import CheckMark from "../../img/svg/checkMark.svg";

import BlockWrapper from "../../components/blockWrapper";
import CompleteApplication from "./forms/completeApplication";
// CONTEXT ------------------------------------------------
import { muiQuery, setGoToAction } from "../../context";

const RegistrationThankYouPage = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const { lg } = muiQuery();
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HANDLERS --------------------------------------------
  const handleRedirect = () => {
    const path = "/about-the-bad/our-values/equality-diversity-and-inclusion/";
    // open policy in new tab
    window.open(path, "_blank");
  };

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    return (
      <div>
        <div style={{ padding: `0 1em 0` }}>
          {CheckMark && (
            <div style={{ width: 60, maxHeight: 60, marginBottom: `1em` }}>
              <Image
                src={CheckMark}
                alt="BAD Complete"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}
          <div className="primary-title" style={styles.title}>
            Thank You
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            Thank you for completing you application for BAD membership. Your
            application must be approved by the BAD Executive Committee and has
            been added to the agenda for their next meeting. An email confirming
            receipt of your application will be sent to you shortly.
          </div>
          <div>
            The BAD wants to meet the aims and commitments set out in its
            <span
              className="caps-btn-no-underline"
              style={{ padding: "0 0.5em" }}
              onClick={handleRedirect}
            >
              equality policy.
            </span>
            This includes not discriminating under the Equality Act 2010, and
            building an accurate picture of the make-up of the membership. The BAD would like to
            ask for your help and co-operation to enable us to do this, but
            filling in this form is voluntary and submission of this information
            will not be considered as part of your application. 
          </div>
          <CompleteApplication />
        </div>
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div style={!lg ? styles.container : styles.containerMobile}>
          <SideBarMenu />
          <ServeContent />
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 2fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  title: {
    fontSize: 20,
  },
};

export default connect(RegistrationThankYouPage);
