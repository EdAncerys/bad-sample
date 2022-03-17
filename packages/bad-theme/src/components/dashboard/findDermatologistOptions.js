import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

import {
  muiQuery,
  useAppState,
  authenticateAppAction,
  useAppDispatch,
} from "../../context";
import { handleGetCookie } from "../../helpers/cookie";
import Loading from "../loading";
const FindDermatologistOptions = ({ state, actions, libraries }) => {
  const [fadData, setFadData] = useState();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const marginVertical = state.theme.marginVertical;
  const { fad, dashboardPath, isActiveUser } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getCurrentUserFadData = async () => {
      const cookie = await handleGetCookie({ name: `BAD-WebApp` });
      const { contactid, jwt } = cookie;

      const fetchData = await fetch(
        state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (fetchData.ok) {
        const json = await fetchData.json();
        setFadData(json);
      }
    };
    getCurrentUserFadData();
  }, []);

  if (!fadData) return <Loading />;
  // HELPERS ----------------------------------------------------------------
  const handlePreferenceUpdate = () => {
    const bad_includeinfindadermatologist = document.querySelector(
      "#includeInFindDermatologist"
    ).checked;
    const mainHospitalWebAddress = document.querySelector(
      "#mainHospitalWebAddress"
    ).value;
    const privatePracticeWebAddressOne = document.querySelector(
      "#privatePracticeWebAddressOne"
    ).value;
    const privatePracticeWebAddressTwo = document.querySelector(
      "#privatePracticeWebAddressTwo"
    ).value;
    const privatePracticeWebAddressThree = document.querySelector(
      "#privatePracticeWebAddressThree"
    ).value;
    const address3_postalcode = document.querySelector(
      "#address3_postalcode"
    ).value;
    const address3_line1 = document.querySelector("#address3_line1").value;
    const address3_line2 = document.querySelector("#address3_line2").value;
    const address3_city = document.querySelector("#address3_city").value;

    const aboutText = document.querySelector("#aboutText").value;
    const compositeText = document.querySelector("#compositeText").value;
    const contactBlurb = document.querySelector("#contactBlurb").value;

    const updatePreferences = {
      bad_includeinfindadermatologist,
      mainHospitalWebAddress,
      privatePracticeWebAddressOne,
      privatePracticeWebAddressTwo,
      privatePracticeWebAddressThree,
      aboutText,
      compositeText,
      contactBlurb,
      address3_postalcode,
      address3_line1,
      address3_line2,
      address3_city,
    };
    console.log("updatePreferences", updatePreferences);
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
                    fadData.bad_includeinfindadermatologist ? true : false
                  }
                  onChange={() => {
                    const data = {
                      ...fadData,
                      bad_includeinfindadermatologist:
                        !fadData.bad_includeinfindadermatologist,
                    };
                    setFadData(data);
                  }}
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
                type="text"
                className="form-control"
                placeholder="Address Line 1"
                style={styles.input}
                value={fadData.address3_line1 ? fadData.address3_line1 : ""}
                onChange={(e) => {
                  const data = {
                    ...fadData,
                    address3_line1: e.target.value,
                  };
                  setFadData(data);
                }}
              />
              <input
                id="address3_line2"
                type="text"
                className="form-control"
                placeholder="Address Line 2"
                style={styles.input}
                value={fadData.address3_line2 ? fad.address3_line2 : ""}
                onChange={(e) => {
                  const data = {
                    ...fadData,
                    address3_line2: e.target.value,
                  };
                  setFadData(data);
                }}
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
                  value={
                    fadData.address3_postalcode
                      ? fadData.address3_postalcode
                      : ""
                  }
                  onChange={(e) => {
                    const data = {
                      ...fadData,
                      address3_postalcode: e.target.value,
                    };
                    setFadData(data);
                  }}
                />
                <input
                  id="address3_city"
                  type="text"
                  className="form-control"
                  placeholder="City"
                  style={styles.input}
                  value={fadData.address3_city ? fadData.address3_city : ""}
                  onChange={(e) => {
                    const data = {
                      ...fadData,
                      address3_city: e.target.value,
                    };
                    setFadData(data);
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: `1em` }}>Website Address</div>
          <div>
            <div className="flex-col">
              <input
                id="mainHospitalWebAddress"
                type="text"
                className="form-control"
                placeholder="Main Hospital Web Address"
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
        <div
          type="submit"
          className="blue-btn"
          onClick={handlePreferenceUpdate}
        >
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
