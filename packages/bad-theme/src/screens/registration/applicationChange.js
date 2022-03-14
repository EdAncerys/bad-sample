import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import Link from "@frontity/components/link";

import { colors } from "../../config/imports";
import BlockWrapper from "../../components/blockWrapper";
import ActionPlaceholder from "../../components/actionPlaceholder";
import Loading from "../../components/loading";
import FormError from "../../components/formError";
// CONTEXT -----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  setErrorAction,
  errorHandler,
  getMembershipDataAction,
  getApplicationStatus,
} from "../../context";

const ApplicationChange = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationChangeData, isActiveUser, dynamicsApps } = useAppState();

  const [membershipData, setMembershipData] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [formData, setFormData] = useState({
    bad_organisedfor: "810170000",
    bad_categorytype: "",
  });
  const [bodyCopy, setBodyCopy] = useState("");

  // ⏬ populate form data values from applicationChangeData
  useEffect(async () => {
    // redirect to /dashboard if isActiveUser && !applicationData
    if (isActiveUser && !applicationChangeData) {
      console.log(
        "⬇️ user have no application data created - redirect to /dashboard"
      );
      setGoToAction({ path: `/dashboard/`, actions });
      return;
    }
    // redirect to / if !isActiveUser || !applicationData
    if (!isActiveUser) {
      console.log("⬇️ no user - redirect to /");
      setGoToAction({ path: `/`, actions });
    }
    if (!applicationChangeData) return null;

    // pre fetch membership data if not already present
    if (!state.source.memberships)
      await getMembershipDataAction({ state, actions });
    const membershipData = Object.values(state.source.memberships);
    setMembershipData(membershipData);

    // API to get membership data based in app ID

    // populate form data values from applicationChangeData
    let appType = null;
    // set data from applicationChangeData object
    if (applicationChangeData) {
      // get application type from applicationChangeData object
      appType = applicationChangeData.bad_categorytype;
      setFormData((prevFormData) => ({
        ...prevFormData,
        bad_categorytype: appType || "",
      }));
    }

    // loop through membershipData & set bodyCopy to match current membership data
    if (membershipData && appType) {
      const membership = membershipData.find(
        (membership) => membership.acf.category_types === appType
      );
      if (membership) setBodyCopy(membership.acf.body_copy);
    }
  }, []);

  // HANDLERS --------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "bad_organisedfor")
      // reset form on category change
      setFormData((prevFormData) => ({
        ...prevFormData,
        bad_categorytype: "",
      }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // set body copy to match current membership data
    if (membershipData) {
      const membership = membershipData.find(
        (membership) => membership.acf.category_types === value
      );
      if (membership) setBodyCopy(membership.acf.body_copy);
    }
    // console.log(value); // debug
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      if (!formData[input]) {
        errorHandler({ id: `form-error-${input}` });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleApplicationChange = async () => {
    // form value validations
    const isValid = isFormValidated({
      required: ["bad_categorytype"],
    });

    if (!isValid) return null;
    // console.log(formData); // debug
    let path = `/dashboard/`;

    try {
      setFetching(true);
      // API to change memberships from applicationChangeData

      // fetch new dynamicsApps data from API
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });
      // redirect to dashboard
      setGoToAction({ path, actions });
      // display error message
      setErrorAction({
        dispatch,
        isError: {
          message: `Application been changed to BAD ${formData.bad_categorytype}.`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `2em 1em 0 1em`,
        }}
      >
        <div
          className="transparent-btn"
          style={{ marginRight: "2em" }}
          onClick={() => setGoToAction({ path: `/dashboard/`, actions })}
        >
          Back
        </div>

        <div className="blue-btn" onClick={handleApplicationChange}>
          Submit Change
        </div>
      </div>
    );
  };

  const ServeForm = () => {
    if (!membershipData) return <Loading />;

    const ServeBADMembershipCategory = () => {
      if (formData.bad_organisedfor !== "810170000") return null;

      return (
        <div>
          <div>
            <div
              className="primary-title"
              style={{ padding: `1em 0`, fontSize: 20 }}
            >
              Current BAD membership: {applicationChangeData.bad_categorytype}
            </div>
            <label className="bold">Change Membership Category to</label>
            <Form.Select
              name="bad_categorytype"
              value={formData.bad_categorytype}
              onChange={handleChange}
              className="input"
            >
              <option value="" hidden>
                Membership Category
              </option>
              {membershipData.map((item, key) => {
                const { bad_or_sig, category_types } = item.acf;
                if (bad_or_sig !== "bad") return null;

                return (
                  <option key={key} value={category_types}>
                    {category_types}
                  </option>
                );
              })}
            </Form.Select>
            <FormError id="bad_categorytype" />
          </div>
          {bodyCopy && (
            <div style={{ paddingTop: "2em" }}>
              <Html2React html={bodyCopy} />
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        className="form-group"
        style={{
          display: "grid",
          gap: 10,
          marginTop: `1em`,
          paddingTop: `1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <ServeBADMembershipCategory />
      </div>
    );
  };

  const ServeContent = () => {
    if (!applicationChangeData) return null;

    return (
      <div>
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            borderBottom: `1px solid ${colors.silverFillTwo}`,
            padding: `0 1em 1em 0`,
          }}
        >
          BAD membership change
        </div>
        <div className="title-link-animation" style={{ padding: `2em 0` }}>
          Form - BAD Category Change Questions
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
          <div
            className="flex-col"
            style={{
              paddingRight: `4em`,
              borderRight: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            <ServeContent />
          </div>
          <div style={{ position: "relative" }}>
            <ActionPlaceholder
              isFetching={isFetching}
              background="transparent"
            />
            <div style={styles.wrapper}>
              <div className="primary-title" style={styles.title}>
                Change of Category Application
              </div>
              <div style={{ paddingTop: `0.75em` }}>
                If you are a current BAD member and now need to change your
                membership category you can apply to do so here. All changes of
                category applications must be approved by the BAD Executive
                committee.
              </div>
              <Link
                link={`/membership/`}
                target="_blank"
                className="caps-btn"
                style={{ padding: `0.5em 0` }}
              >
                Memberships Categories
              </Link>
              <ServeForm />
            </div>
            <ServeActions />
          </div>
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
    borderBottom: `1px solid ${colors.silverFillTwo}`,
    padding: `0 1em 2em`,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontWeight: "bold",
    padding: `0.75em 0`,
  },
};

export default connect(ApplicationChange);
