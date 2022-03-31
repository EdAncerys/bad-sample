import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import Link from "@frontity/components/link";

import { colors } from "../../config/imports";
import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";
import ActionPlaceholder from "../../components/actionPlaceholder";
import Loading from "../../components/loading";
import FormError from "../../components/formError";
// CONTEXT -----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  handleApplyForMembershipAction,
  errorHandler,
  getMembershipDataAction,
} from "../../context";

const RegistrationStepTwo = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();

  const [membershipData, setMembershipData] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [formData, setFormData] = useState({
    bad_organisedfor: "",
    bad_categorytype: "",
  });
  const [bodyCopy, setBodyCopy] = useState("");

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    // pre fetch membership data
    if (!state.source.memberships)
      await getMembershipDataAction({ state, actions });
    let membershipData = Object.values(state.source.memberships);
    // sort memberships by bad_order accenting & if no value push to end
    membershipData.sort((a, b) => {
      // sort memberships alphabetically
      if (a.bad_order < b.bad_order) return -1;
      if (a.bad_order > b.bad_order) return 1;
      return 0;

      // uncomment to sort by bad_order
      // if (a.acf.bad_order && b.acf.bad_order) {
      //   return a.acf.bad_order - b.acf.bad_order;
      // } else if (a.acf.bad_order) {
      //   return -1;
      // } else if (b.acf.bad_order) {
      //   return 1;
      // } else {
      //   return 0;
      // }
    });

    setMembershipData(membershipData);

    // populate form data values from applicationData
    if (!applicationData) return null;
    const handleSetData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    const isSIG = applicationData[0].bad_organisedfor === "SIG";
    let appType = null;

    applicationData.map((data) => {
      // set data from Dynamics membership object
      if (data.name === "bad_organisedfor")
        handleSetData({ data, name: "bad_organisedfor" });
      // set data from custom object type based on CATEGORY
      if (data.bad_categorytype) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          bad_categorytype: isSIG
            ? data.bad_categorytype + ":" + data._bad_sigid_value
            : data.bad_categorytype,
        }));
        appType = data.bad_categorytype;
      }
    });

    // loop through membershipData & set bodyCopy to match current membership data
    if (membershipData && appType) {
      const membership = membershipData.find(
        (membership) => membership.acf.category_types === appType
      );
      if (membership) setBodyCopy(membership.acf.body_copy);
    }
  }, []);

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    await handleApplyForMembershipAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      dynamicsApps,
      category: formData.bad_organisedfor === "810170000" ? "BAD" : "SIG",
      type: formData.bad_categorytype, // application type name
      path: `/membership/`,
    });
  };

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
    console.log(value);
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

  const handleNext = async () => {
    // form value validations
    const isValid = isFormValidated({
      required: ["bad_organisedfor", "bad_categorytype"],
    });

    if (!isValid) return null;
    // console.log(formData); // debug
    let path = `/membership/step-3-personal-information/`;
    if (formData.bad_organisedfor === "810170001")
      path = `/membership/sig-questions/`;

    try {
      setFetching(true);
      await handleApplyForMembershipAction({
        state,
        actions,
        dispatch,
        applicationData,
        isActiveUser,
        dynamicsApps,
        membershipApplication: { stepTwo: true }, // set stepOne to complete
        category: formData.bad_organisedfor === "810170000" ? "BAD" : "SIG",
        type: formData.bad_categorytype, // application type name
        path,
        canUpdateApplication: true,
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
          onClick={() =>
            setGoToAction({ state, path: `/membership/`, actions })
          }
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: `0 1em` }}
          onClick={handleSaveExit}
        >
          Save & Exit
        </div>
        <div className="blue-btn" onClick={handleNext}>
          Next
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
            <label className="bold">Membership Category</label>
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

    const ServeSIGMembershipCategory = () => {
      if (formData.bad_organisedfor !== "810170001") return null;

      return (
        <div>
          <label className="bold">Membership Category</label>
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
              if (bad_or_sig !== "sig") return null;
              // get SIG membership categories name from custom object
              let typeName = category_types.split(":")[1];

              return (
                <option key={key} value={category_types}>
                  {typeName}
                </option>
              );
            })}
          </Form.Select>
          <FormError id="bad_categorytype" />
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
        <ServeSIGMembershipCategory />
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
          <div style={{ position: "relative" }}>
            <ActionPlaceholder
              isFetching={isFetching}
              background="transparent"
            />
            <div style={styles.wrapper}>
              <div className="primary-title" style={styles.title}>
                Category Selection
              </div>
              <div style={{ paddingTop: `0.75em` }}>
                Please confirm your category selction. Or if you are unsure of
                the category you should be applying for please view the
                membership category descriptions for further clarification.
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

export default connect(RegistrationStepTwo);
