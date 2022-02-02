import { useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import SideBarMenu from "./sideBarMenu";
import { Form } from "react-bootstrap";
import CheckMark from "../../img/svg/checkMark.svg";
import { setGoToAction } from "../../context";
import BlockWrapper from "../../components/blockWrapper";

import { ETHNIC_GROUPES } from "../../config/data";

const RegistrationComplete = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const ethnicGroupRef = useRef(null);

  // HANDLERS --------------------------------------------
  const handleSubmit = () => {
    const ethnicGroup = ethnicGroupRef.current.value;

    const details = {
      ethnicGroup,
    };

    console.log(details);
  };

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
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <div
          className="blue-btn"
          onClick={() => {
            handleSubmit();
            // setGoToAction({ path: `/membership/`, actions });
          }}
        >
          Enter
        </div>
      </div>
    );
  };

  const ServeForm = () => {
    return (
      <div
        className="form-group"
        style={{
          display: "grid",
          gap: 10,
          padding: `0 0 2em`,
        }}
      >
        <label style={styles.subTitle}>What is your Ethnic Group?</label>
        <Form.Select ref={ethnicGroupRef} style={styles.input}>
          <option value="null">Ethnic Group</option>
          {ETHNIC_GROUPES.map((item, key) => {
            return (
              <option key={key} value={item}>
                {item}
              </option>
            );
          })}
        </Form.Select>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div>
        <div style={styles.wrapper}>
          <ServeCardImage />
          <div className="primary-title" style={styles.title}>
            Thank You
          </div>
          <div
            style={{
              paddingBottom: `1em`,
              borderBottom: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            Thank you for completing you application for BAD membership. Your
            application must be approved by the BAD Executive Committee and has
            been added to the agenda for their next meeting. An email confirming
            receipt of your application will be sent to you shortly.
          </div>
          <div className="primary-title" style={styles.title}>
            Ethnic Diversity Monitoring
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
    padding: `1em 0`,
  },
  subTitle: {
    fontWeight: "bold",
    padding: `1em 0`,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(RegistrationComplete);
