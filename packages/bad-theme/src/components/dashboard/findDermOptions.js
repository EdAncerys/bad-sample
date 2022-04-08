import { useState, useEffect } from "react";
import { connect } from "frontity";
import ProfileAvatar from "./profileAvatar";
import { handleGetCookie } from "../../helpers/cookie";
import Loading from "../loading";

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  setErrorAction,
  useAppDispatch,
  muiQuery,
} from "../../context";

const FindDermatologistOptions = ({ state }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [fadData, setFadData] = useState({
    bad_includeinfindadermatologist: "",
    address3_postalcode: "",
    address3_line1: "",
    address3_line2: "",
    address3_city: "",
    bad_mainhosptialweb: "",
    bad_web3: "",
    bad_web2: "",
    bad_web1: "",
    bad_findadermatologisttext: "",
  });

  useEffect(() => {
    if (!isActiveUser) return null;

    setFadData((prevFromData) => ({
      ...prevFromData,
      bad_includeinfindadermatologist:
        isActiveUser.bad_includeinfindadermatologist,
      address3_postalcode: isActiveUser.address3_postalcode || "",
      address3_line1: isActiveUser.address3_line1 || "",
      address3_line2: isActiveUser.address3_line2 || "",
      address3_city: isActiveUser.address3_city || "",
      bad_mainhosptialweb: isActiveUser.bad_mainhosptialweb || "",
      bad_web3: isActiveUser.bad_web3 || "",
      bad_web2: isActiveUser.bad_web2 || "",
      bad_web1: isActiveUser.bad_web1 || "",
      bad_findadermatologisttext: isActiveUser.bad_findadermatologisttext || "",
    }));
  }, []);

  // HELPERS ---------------------------------------------
  const handlePreferenceUpdate = async () => {
    const cookie = await handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;
    const url = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

    const submitUpdate = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fadData),
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

  if (!fadData) return <Loading />;

  return (
    <div
      className="shadow"
      style={{
        padding: `2em 4em`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePreferenceUpdate();
        }}
      >
        <div style={{ display: "grid" }}>
          <div className="flex-col">
            <div className="flex">
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
                        checked={fadData.bad_includeinfindadermatologist}
                        onChange={() => {
                          setFadData((prev) => ({
                            ...prev,
                            bad_includeinfindadermatologist:
                              !fadData.bad_includeinfindadermatologist,
                          }));
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
                      name="address3_line1"
                      type="text"
                      className="form-control"
                      placeholder="Address Line 1"
                      style={styles.input}
                      value={fadData.address3_line1}
                      onChange={(e) => {
                        setFadData((prev) => ({
                          ...prev,
                          address3_line1: e.target.value,
                        }));
                      }}
                    />
                    <input
                      id="address3_line2"
                      type="text"
                      className="form-control"
                      placeholder="Address Line 2"
                      style={styles.input}
                      value={fadData.address3_line2}
                      onChange={(e) => {
                        setFadData((prev) => ({
                          ...prev,
                          address3_line2: e.target.value,
                        }));
                      }}
                    />

                    <input
                      id="address3_postalcode"
                      type="text"
                      className="form-control"
                      placeholder="Post Code"
                      style={styles.input}
                      value={fadData.address3_postalcode}
                      onChange={(e) => {
                        setFadData((prev) => ({
                          ...prev,
                          address3_postalcode: e.target.value,
                        }));
                      }}
                    />
                    <input
                      id="address3_city"
                      type="text"
                      className="form-control"
                      placeholder="City"
                      style={styles.input}
                      value={fadData.address3_city}
                      onChange={(e) => {
                        setFadData((prev) => ({
                          ...prev,
                          address3_city: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <ProfileAvatar />
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
                  value={fadData.bad_mainhosptialweb}
                  onChange={(e) => {
                    setFadData((prev) => ({
                      ...prev,
                      bad_mainhosptialweb: e.target.value,
                    }));
                  }}
                />
                <input
                  id="privatePracticeWebAddressOne"
                  type="text"
                  className="form-control"
                  placeholder="Private Practice Web Address 1"
                  style={styles.input}
                  value={fadData.bad_web1}
                  onChange={(e) => {
                    setFadData((prev) => ({
                      ...prev,
                      bad_web1: e.target.value,
                    }));
                  }}
                />
                <input
                  id="privatePracticeWebAddressTwo"
                  type="text"
                  className="form-control"
                  placeholder="Private Practice Web Address 2"
                  style={styles.input}
                  value={fadData.bad_web2}
                  onChange={(e) => {
                    setFadData((prev) => ({
                      ...prev,
                      bad_web2: e.target.value,
                    }));
                  }}
                />
                <input
                  id="privatePracticeWebAddressThree"
                  type="text"
                  className="form-control"
                  placeholder="Private Practice Web Address 3"
                  style={styles.input}
                  value={fadData.bad_web3}
                  onChange={(e) => {
                    setFadData((prev) => ({
                      ...prev,
                      bad_web3: e.target.value,
                    }));
                  }}
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
                  value={fadData.bad_findadermatologisttext}
                  onChange={(e) => {
                    setFadData((prev) => ({
                      ...prev,
                      bad_findadermatologisttext: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex"
          style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
        >
          <div type="submit" className="blue-btn">
            Update
          </div>
        </div>
      </form>
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
