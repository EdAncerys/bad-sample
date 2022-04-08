import { useState, useEffect, useRef } from "react";
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
  sendFileToS3Action,
} from "../../context";

const FindDermatologistOptions = ({ state }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [formData, setFormData] = useState({
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
    bad_profile_photo_url: "",
  });
  const documentRef = useRef(null);

  useEffect(() => {
    if (!isActiveUser) return null;

    setFormData((prevFromData) => ({
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
      body: JSON.stringify(formData),
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

  const handleDocUploadChange = async (e) => {
    let bad_profile_photo_url = e.target.files[0];

    if (bad_profile_photo_url)
      bad_profile_photo_url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: bad_profile_photo_url,
        refreshJWT,
      });
    // console.log("bad_profile_photo_url", bad_profile_photo_url); // debug

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["bad_profile_photo_url"]: bad_profile_photo_url, // update formData
    }));
  };

  if (!formData) return <Loading />;

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
                        checked={formData.bad_includeinfindadermatologist}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            bad_includeinfindadermatologist:
                              !formData.bad_includeinfindadermatologist,
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
                      value={formData.address3_line1}
                      onChange={(e) => {
                        setFormData((prev) => ({
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
                      value={formData.address3_line2}
                      onChange={(e) => {
                        setFormData((prev) => ({
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
                      value={formData.address3_postalcode}
                      onChange={(e) => {
                        setFormData((prev) => ({
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
                      value={formData.address3_city}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          address3_city: e.target.value,
                        }));
                      }}
                    />

                    <div>
                      <label>Upload A Profile Photo</label>
                      <input
                        ref={documentRef}
                        onChange={handleDocUploadChange}
                        type="file"
                        className="form-control input"
                        placeholder="Profile Photo"
                        accept="image/png, image/jpeg"
                      />
                    </div>
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
                  value={formData.bad_mainhosptialweb}
                  onChange={(e) => {
                    setFormData((prev) => ({
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
                  value={formData.bad_web1}
                  onChange={(e) => {
                    setFormData((prev) => ({
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
                  value={formData.bad_web2}
                  onChange={(e) => {
                    setFormData((prev) => ({
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
                  value={formData.bad_web3}
                  onChange={(e) => {
                    setFormData((prev) => ({
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
                  value={formData.bad_findadermatologisttext}
                  onChange={(e) => {
                    setFormData((prev) => ({
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
