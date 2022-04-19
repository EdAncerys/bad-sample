import { connect } from "frontity";

import Image from "@frontity/components/image";
import SideBarMenu from "./sideBarMenu";
import CheckMark from "../../img/svg/checkMark.svg";

import BlockWrapper from "../../components/blockWrapper";
import CompleteApplication from "./forms/completeApplication";
import { muiQuery } from "../../context";
const RegistrationThankYouPage = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const { lg } = muiQuery();
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

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
            equality policy. This includes not discriminating under the Equality
            Act 2010, and building an accurate picture of the make-up of the
            membership. You can find our Equal Opportunities Policy here. The
            BAD would like to ask for your help and co-operation to enable us to
            do this, but filling in this form is voluntary and submission of
            this information will not be considered as part of your application.
            In line with the 2021 UK census questions, when asking about your
            ethnicity we first ask for the broad ethnic group which you identify
            with, this is then followed by a question asking for a more specific
            ethnic background.
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
