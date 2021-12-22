import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import SideBarMenu from "./sideBarMenu";
import { Form } from "react-bootstrap";
import CheckMark from "../../img/svg/checkMark.svg";
import { setGoToAction } from "../../context";
import BlockWrapper from "../../components/blockWrapper";

const RegistrationComplete = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    const alt = "BAD Complete";

    return (
      <div style={{ width: 60, maxHeight: 60 }}>
        <Image
          src={CheckMark}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `1em 0`,
          borderTop: `1px solid ${colors.darkSilver}`,
        }}
      >
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() => setGoToAction({ path: `/`, actions })}
        >
          Enter
        </button>
      </div>
    );
  };

  const ServeForm = () => {
    return (
      <div
        className="form-group"
        style={{
          display: "grid",
          gap: 5,
          padding: `1em 0 2em`,
        }}
      >
        <label style={styles.subTitle}>What is your Ethnic Group?</label>
        <Form.Select aria-label="Default select example" style={styles.input}>
          <option>Membership Category</option>
          <option value="1">Category one</option>
          <option value="2">Category Two</option>
          <option value="3">Category Three</option>
          <option value="3">Category Four</option>
        </Form.Select>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <ServeCardImage />
          <div className="primary-title" style={styles.title}>Thank You</div>
          <div
            style={{
              paddingBottom: `1em`,
              borderBottom: `1px solid ${colors.darkSilver}`,
            }}
          >
            Thank you for completing you application for BAD membership. Your
            application must be approved by the BAD Executive Committee and has
            been added to the agenda for their next meeting. An email confirming
            receipt of your application will be sent to you shortly.
          </div>
          <div className="primary-title" style={styles.title}>Ethnic Diversity Monitoring</div>
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

          <ServeForm />
          <ServeActions />
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
        <div style={styles.container}>
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
  wrapper: {
    margin: `0 1em 0`,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    padding: `1em 0`,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    padding: `1em 0`,
  },
  link: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.blue,
    textDecoration: "underline",
    cursor: "pointer",
    padding: `0.75em 0`,
  },
  input: {
    borderRadius: 10,
    color: colors.darkSilver,
  },
};

export default connect(RegistrationComplete);
