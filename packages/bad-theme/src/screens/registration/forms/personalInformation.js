import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Form } from "react-bootstrap";

import Avatar from "../../../img/svg/profile.svg";
import { colors } from "../../../config/imports";
import FormError from "../../../components/formError";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  setGoToAction,
  validateMembershipFormAction,
  errorHandler,
} from "../../../context";

const PersonalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const [genderList, setGenderList] = useState([]);
  const [formData, setFormData] = useState({
    py3_title: "",
    py3_firstname: "",
    py3_lastname: "",
    py3_gender: "",
    py3_email: "",
    py3_mobilephone: "",
    py3_address1ine1: "",
    py3_addressline2: "",
    py3_addresstowncity: "",
    py3_addresscountystate: "",
    py3_addresszippostalcode: "",
    py3_addresscountry: "",
    sky_profilepicture: "",
    py3_dateofbirth: "",
  });
  const [inputValidator, setInputValidator] = useState({
    py3_title: true,
    py3_firstname: true,
    py3_lastname: true,
    py3_gender: true,
    py3_email: true,
    py3_mobilephone: true,
    py3_address1ine1: true,
    py3_addressline2: true,
    py3_addresstowncity: true,
    py3_addresscountystate: true,
    py3_addresszippostalcode: true,
    py3_addresscountry: true,
    sky_profilepicture: true,
    py3_dateofbirth: true,
  });
  const documentRef = useRef(null);

  // ⏬ populate form data values from applicationData
  useEffect(() => {
    const handleSetData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "py3_title") handleSetData({ data, name: "py3_title" });
      if (data.name === "py3_firstname")
        handleSetData({ data, name: "py3_firstname" });
      if (data.name === "py3_lastname")
        handleSetData({ data, name: "py3_lastname" });
      if (data.name === "py3_gender") {
        handleSetData({ data, name: "py3_gender" });
        setGenderList(data.info.Choices);
      }
      if (data.name === "py3_email") handleSetData({ data, name: "py3_email" });
      if (data.name === "py3_mobilephone")
        handleSetData({ data, name: "py3_mobilephone" });
      if (data.name === "py3_address1ine1")
        handleSetData({ data, name: "py3_address1ine1" });
      if (data.name === "py3_addressline2")
        handleSetData({ data, name: "py3_addressline2" });
      if (data.name === "py3_addresstowncity")
        handleSetData({ data, name: "py3_addresstowncity" });
      if (data.name === "py3_addresscountystate")
        handleSetData({ data, name: "py3_addresscountystate" });
      if (data.name === "py3_addresszippostalcode")
        handleSetData({ data, name: "py3_addresszippostalcode" });
      if (data.name === "py3_addresscountry")
        handleSetData({ data, name: "py3_addresscountry" });
      if (data.name === "sky_profilepicture")
        handleSetData({ data, name: "sky_profilepicture" });
      if (data.name === "py3_dateofbirth")
        handleSetData({ data, name: "py3_dateofbirth" });
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
  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      if (!formData[input] && inputValidator[input]) {
        errorHandler({ id: `form-error-${input}` });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleNext = async () => {
    const isValid = isFormValidated({
      required: [
        "py3_title",
        "py3_firstname",
        "py3_lastname",
        "py3_gender",
        "py3_email",
        "py3_mobilephone",
        "py3_address1ine1",
        "py3_addresstowncity",
        "py3_addresszippostalcode",
        "py3_addresscountry",
      ],
    });
    if (!isValid) return null;

    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      membershipApplication: { stepTwo: true }, // set stepOne to complete
      data: formData,
    });

    let slug = `/membership/step-3-category-selection/`;
    if (isActiveUser) setGoToAction({ path: slug, actions });

    // console.log(formData); // debug
  };

  const handleDocUploadChange = async () => {
    let sky_profilepicture = documentRef.current.files[0];
    // const objectURL = URL.createObjectURL(sky_profilepicture);

    if (sky_profilepicture)
      sky_profilepicture = await sendFileToS3Action({
        state,
        dispatch,
        attachments: sky_profilepicture,
      });

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["sky_profilepicture"]: sky_profilepicture,
    }));
    console.log("sky_profilepicture", sky_profilepicture); // debug
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(formData); // debug
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-1-the-process/`,
              actions,
            })
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

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          justifyContent: "space-between",
          gap: 20,
          padding: `2em 0`,
        }}
      >
        <div>
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src={formData.sky_profilepicture || Avatar}
              alt="Profile Avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="bold" style={{ padding: `1em 0` }}>
            Upload A Profile Photo
          </div>

          <input
            ref={documentRef}
            onChange={handleDocUploadChange}
            type="file"
            className="form-control input"
            placeholder="Profile Photo"
            accept="image/*"
          />
        </div>

        <form>
          <div style={{ padding: `0 1em 1em` }}>
            {inputValidator.py3_title && (
              <div>
                <label className="required form-label">Title</label>
                <Form.Select
                  name="py3_title"
                  value={formData.py3_title}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="" hidden>
                    Professor, Dr, Mr, Miss, Ms
                  </option>
                  <option value="Dr">Dr</option>
                  <option value="Mr">Mr</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Professor">Professor</option>
                </Form.Select>
                <FormError id="py3_title" />
              </div>
            )}

            {inputValidator.py3_firstname && (
              <div>
                <label className="form-label required">First Name</label>
                <input
                  name="py3_firstname"
                  value={formData.py3_firstname}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="First Name"
                />
                <FormError id="py3_firstname" />
              </div>
            )}

            {inputValidator.py3_lastname && (
              <div>
                <label className="form-label required">Last Name</label>
                <input
                  name="py3_lastname"
                  value={formData.py3_lastname}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Last Name"
                />
                <FormError id="py3_lastname" />
              </div>
            )}

            {inputValidator.py3_gender && (
              <div>
                <label className="required form-label">Gender</label>
                <Form.Select
                  name="py3_gender"
                  value={formData.py3_gender}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="" hidden>
                    Male, Female, Transgender, Prefer Not To Answer
                  </option>
                  {genderList.map((item, key) => {
                    return (
                      <option key={key} value={item.value}>
                        {item.Label}
                      </option>
                    );
                  })}
                </Form.Select>
                <FormError id="py3_gender" />
              </div>
            )}

            {inputValidator.py3_dateofbirth && (
              <div>
                <label className="form-label">Date of Birth</label>
                <input
                  name="py3_dateofbirth"
                  value={formData.py3_dateofbirth}
                  onChange={handleInputChange}
                  type="date"
                  className="form-control input"
                  placeholder="Date of Birth"
                />
              </div>
            )}

            {inputValidator.py3_email && (
              <div>
                <label className="form-label required">Email</label>
                <input
                  name="py3_email"
                  value={formData.py3_email}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Email"
                />
              </div>
            )}

            {inputValidator.py3_mobilephone && (
              <div>
                <label className="form-label required">Mobile Number</label>
                <input
                  name="py3_mobilephone"
                  value={formData.py3_mobilephone}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Mobile Number"
                />
                <FormError id="py3_mobilephone" />
              </div>
            )}
          </div>

          <div
            style={{
              padding: `1em 1em`,
              display: "grid",
              gap: 10,
            }}
          >
            {inputValidator.py3_address1ine1 && (
              <div>
                <label className="required form-label">Home Address</label>
                <input
                  name="py3_address1ine1"
                  value={formData.py3_address1ine1}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Address Line 1"
                />
                <FormError id="py3_address1ine1" />
              </div>
            )}

            {inputValidator.py3_addressline2 && (
              <input
                name="py3_addressline2"
                value={formData.py3_addressline2}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Address Line 2"
              />
            )}
            {inputValidator.py3_addresstowncity && (
              <div>
                <input
                  name="py3_addresstowncity"
                  value={formData.py3_addresstowncity}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="City"
                />
                <FormError id="py3_addresstowncity" />
              </div>
            )}
            {inputValidator.py3_addresscountystate && (
              <div>
                <input
                  name="py3_addresscountystate"
                  value={formData.py3_addresscountystate}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="County/State"
                />
                <FormError id="py3_addresscountystate" />
              </div>
            )}
            {inputValidator.py3_addresszippostalcode && (
              <div>
                <input
                  name="py3_addresszippostalcode"
                  value={formData.py3_addresszippostalcode}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Postcode/Zip"
                />
                <FormError id="py3_addresszippostalcode" />
              </div>
            )}
            {inputValidator.py3_addresscountry && (
              <div>
                <input
                  name="py3_addresscountry"
                  value={formData.py3_addresscountry}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Country"
                />
                <FormError id="py3_addresscountry" />
              </div>
            )}
          </div>
        </form>
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PersonalDetails);
