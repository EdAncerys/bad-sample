import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { ETHNIC_GROUPS } from "../../../config/data";
import { colors } from "../../../config/imports";
import ActionPlaceholder from "../../../components/actionPlaceholder";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateEthnicityAction,
  setGoToAction,
  validateMembershipFormAction,
  loginAction,
  getEthnicityAction,
} from "../../../context";

const CompleteApplication = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, ethnicity, refreshJWT } =
    useAppState();

  const [ethnicityList, setEthnicityList] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    bad_ethnicity: "",
  });

  const [inputValidator, setInputValidator] = useState({
    bad_ethnicity: true,
  });
  const useEffectRef = useRef(true);

  useEffect(async () => {
    // ⬇️ get ethnicity choices from Dynamics
    if (!ethnicity) await getEthnicityAction({ state, dispatch, refreshJWT });

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    const handleSetData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "bad_ethnicity") {
        handleSetData({ data, name: "bad_ethnicity" });
        setEthnicityList(data.info.Choices);
      }
    });

    // ⏬ validate inputs
    validateMembershipFormAction({
      state,
      actions,
      setData: setInputValidator,
      applicationData,
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleSubmit = async () => {
    if (!isActiveUser) {
      // validate if isActiveUser 🤖
      loginAction({ state });
      return null;
    }

    try {
      setFetching(true);
      // handle update ethnicity for user contact
      await updateEthnicityAction({
        state,
        dispatch,
        data: formData.bad_ethnicity,
        isActiveUser,
      });

      let slug = `/dashboard/`;
      if (isActiveUser) setGoToAction({ state, path: slug, actions });
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `2em 1em 0 1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        <div className="blue-btn" onClick={handleSubmit}>
          Submit
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      {inputValidator.bad_ethnicity && (
        <form>
          <div style={{ padding: `2em 1em` }}>
            {ethnicity && (
              <div>
                <label style={styles.subTitle}>What is your Ethnicity?</label>
                <Form.Select
                  name="bad_ethnicity"
                  value={formData.bad_ethnicity}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="" hidden>
                    Ethnicity
                  </option>
                  {ethnicity.map((item, key) => {
                    return (
                      <option key={key} value={item.value}>
                        {item.Label}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            )}
          </div>
        </form>
      )}
      <ServeActions />
    </div>
  );
};

const styles = {
  title: {
    fontSize: 20,
  },
};

export default connect(CompleteApplication);
