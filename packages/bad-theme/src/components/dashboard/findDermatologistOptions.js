import { useState, useEffect, useReducer, useCallback } from "react";
import { connect } from "frontity";

import {
  muiQuery,
  setErrorAction,
  useAppDispatch,
  fetchDataHandler,
} from "../../context";
import { handleGetCookie } from "../../helpers/cookie";
import Loading from "../loading";
function enhancedReducer(fadState, updateArg) {
  // check if the type of update argument is a callback function
  if (updateArg.constructor === Function) {
    return { ...fadState, ...updateArg(fadState) };
  }

  // if the type of update argument is an object
  if (updateArg.constructor === Object) {
    // does the update object have _path and _value as it's keys
    // if yes then use them to update deep object values
    if (has(updateArg, "_path") && has(updateArg, "_value")) {
      const { _path, _value } = updateArg;

      return produce(fadState, (draft) => {
        set(draft, _path, _value);
      });
    } else {
      return { ...fadState, ...updateArg };
    }
  }
}
const FindDermatologistOptions = ({ state, actions, libraries }) => {
  const [fadData, setFadData] = useState();

  const { sm, md, lg, xl } = muiQuery();
  const dispatch = useAppDispatch();

  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    const getCurrentUserFadData = async () => {
      const cookie = await handleGetCookie({ name: `BAD-WebApp` });
      const { contactid, jwt } = cookie;

      const path =
        state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;
      const fetchData = await fetchDataHandler({ path, state });

      if (fetchData.ok) {
        const json = await fetchData.json();
        setFadData({
          bad_includeinfindadermatologist: json.bad_includeinfindadermatologist,
          address3_postalcode: json.address3_postalcode || "",
          address3_line1: json.address3_line1 || "",
          address3_line2: json.address3_line2 || "",
          address3_city: json.address3_city || "",
          bad_mainhosptialweb: json.bad_mainhosptialweb || "",
          bad_web3: json.bad_web3 || "",
          bad_web2: json.bad_web2 || "",
          bad_web1: json.bad_web1 || "",
        });
      }
    };
    getCurrentUserFadData();
  }, []);

  if (!fadData) return <Loading />;

  const [fadState, updateState] = useReducer(enhancedReducer, fadData);
  const updateForm = useCallback(({ target: { value, name, type } }) => {
    const updatePath = name.split(".");

    // if the input is a checkbox then use callback function to update
    // the toggle state based on previous state
    if (type === "checkbox") {
      updateState((prevState) => ({
        [name]: !prevState[name],
      }));

      return;
    }

    // if we have to update the root level nodes in the form
    if (updatePath.length === 1) {
      const [key] = updatePath;

      updateState({
        [key]: value,
      });
    }

    // if we have to update nested nodes in the form object
    // use _path and _value to update them.
    if (updatePath.length === 2) {
      updateState({
        _path: updatePath,
        _value: value,
      });
    }
  }, []);

  if (!fadData) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handlePreferenceUpdate = async () => {
    const cookie = await handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;

    const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;
    const submitUpdate = await fetchDataHandler({
      path,
      method: "PATCH",
      state,
    });

    if (submitUpdate.ok) {
      const json = await submitUpdate.json();
      json.success
        ? setErrorAction({
            dispatch,
            isError: { message: "Updated" },
          })
        : setErrorAction({
            dispatch,
            isError: { message: "There was an error processing the update" },
          });
    }
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    return (
      <div style={{ display: "grid" }}>
        <div className="flex-col">
          <div>
            <div
              className="flex"
              style={{ alignItems: "center", margin: `1em 0` }}
            >
              <div style={{ display: "grid" }}>
                <input
                  id="includeInFindDermatologist"
                  type="checkbox"
                  className="form-check-input check-box"
                  checked={
                    fadState.bad_includeinfindadermatologist ? true : false
                  }
                  onChange={updateForm}
                />
              </div>
              <div style={styles.textInfo}>
                I would like to be included in the Find a Dermatologist
                directory
              </div>
            </div>
          </div>
          <div style={{ paddingTop: `1em` }}>
            Practice address to show in the directory
          </div>
          <div>
            <div className="flex-col">
              <input
                id="address3_line1"
                name="address3_line1"
                type="text"
                className="form-control"
                placeholder="Address Line 1"
                style={styles.input}
                value={fadState.address3_line1}
                onChange={updateForm}
              />
              <input
                id="address3_line2"
                type="text"
                className="form-control"
                placeholder="Address Line 2"
                style={styles.input}
                value={fadData.address3_line2}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <input
                  id="address3_postalcode"
                  type="text"
                  className="form-control"
                  placeholder="Post Code"
                  style={styles.input}
                  value={fadData.address3_postalcode}
                />
                <input
                  id="address3_city"
                  type="text"
                  className="form-control"
                  placeholder="City"
                  style={styles.input}
                  value={fadData.address3_city ? fadData.address3_city : ""}
                />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: `1em` }}>
            Private Practice Website Address
          </div>
          <div>
            <div className="flex-col">
              <input
                id="mainHospitalWebAddress"
                type="text"
                className="form-control"
                placeholder="Main Place of Work"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressOne"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 1"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressTwo"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 2"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressThree"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 3"
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ paddingTop: `1em` }}>About Text</div>
          <div>
            <div className="flex-col">
              <textarea
                id="aboutText"
                type="text"
                className="form-control"
                placeholder="Find a Dermatologist About Text"
                rows="10"
                style={styles.input}
              />
              <textarea
                id="compositeText"
                type="text"
                className="form-control"
                placeholder="Composite Find A Dermatologist Text"
                rows="10"
                style={styles.input}
              />
              <textarea
                id="contactBlurb"
                type="text"
                className="form-control"
                placeholder="Contact Blurb"
                rows="10"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div className="blue-btn" onClick={() => handlePreferenceUpdate()}>
          Update
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Find a Dermatologist:
      </div>
      <div style={{ padding: `1em 0` }}>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    margin: `0.5em 0`,
  },
  textInfo: {
    paddingLeft: `0.5em`,
  },
};

export default connect(FindDermatologistOptions);
