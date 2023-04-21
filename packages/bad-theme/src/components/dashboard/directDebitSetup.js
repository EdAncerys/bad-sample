import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import DirectDebit from "../../img/svg/directDebit.svg";
import Loading from "../../components/loading";
import FormError from "../../components/formError";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  errorHandler,
  setDebitHandlerAction,
} from "../../context";

const DirectDebitPayment = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser, directDebitPath } = useAppState();

  const [formData, setFormData] = useState({
    py3_email: "",
    core_name: "",
    core_accountnumber: "",
    core_sortcode: "",
  });

  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    if (!isActiveUser) return null;

    let accountNumber = "";
    let sortCode = "";
    if (directDebitPath.data) {
      // populate account details on component reload if data available
      accountNumber = directDebitPath.data.core_accountnumber || "";
      sortCode = directDebitPath.data.core_sortcode || "";
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [`py3_email`]: isActiveUser.emailaddress1 || "",
      [`core_name`]: isActiveUser.fullname || "",
      [`core_accountnumber`]: accountNumber,
      [`core_sortcode`]: sortCode,
    }));
  }, [directDebitPath]);

  if (!isActiveUser) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let formattedValue = value;

    if (name === "core_sortcode") {
      // --------------------------------------------------------------------------------
      // 📌  To enable character representation as per example : 11-11-11
      // Uncomment handler below & change input type to text instead
      // --------------------------------------------------------------------------------
      // const digits = value.replace(/\D/g, "");
      // formattedValue = digits
      //   .slice(0, 6)
      //   .replace(
      //     /^(\d{2})(\d{1,2})?(\d{1,2})?/,
      //     (_, group1, group2, group3) =>
      //       group1 + (group2 ? "-" + group2 : "") + (group3 ? "-" + group3 : "")
      //   );

      formattedValue = value?.toString()?.slice(0, 6) ?? "";
    }

    if (name === "core_accountnumber") {
      formattedValue = value?.toString()?.slice(0, 8) ?? "";
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
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

  const handleDirectDebitSetup = async () => {
    // form value validations
    const isValid = isFormValidated({
      required: [
        "py3_email",
        "core_name",
        "core_sortcode",
        "core_accountnumber",
      ],
    });

    if (!isValid) return null;

    setDebitHandlerAction({
      dispatch,
      directDebitPath: { page: "directDebitPayment", data: formData },
    });
  };

  // HELPERS ----------------------------------------------------------------
  const handleCancel = () => {
    setDebitHandlerAction({ dispatch, directDebitPath: { page: "billing" } });
  };

  // SERVERS ---------------------------------------------
  const ServeInfo = () => {
    return (
      <div>
        <div style={{ padding: `1em 0` }}>
          By submitting this direct debit request you are verifying that you are
          the account holder and therefore the payer and also that you are the
          only person required to authorise debits from the account. If you are
          not the account holder or more than one person has to authorise debits
          from the account then you must complete a paper direct debit mandate.
          If this is the case, please contact us at membership@bad.org.uk to
          arrange. When you set up your direct debit all of you BAD and Special
          Interest Groups subscriptions will be collected via this method. Your
          instructions will be collected on the 1st January each year, or
          nearest working day thereafter.
        </div>
        <div>
          <span className="required" />
          Mandatory fields
        </div>
      </div>
    );
  };

  const ServeConditions = () => {
    return (
      <div style={{ paddingTop: `2em` }}>
        You will receive advance notice of at least 5 days of any amount to be
        debited under the instruction. Payments will show as 'British
        Association of Dermatologists' on your bank statement. After you
        complete the set up an email confirmation will be sent to (enter email)
        within 3 working days.
      </div>
    );
  };

  const ServeDirectDebitInfo = () => {
    if (!DirectDebit) return null;

    return (
      <div style={{ width: "100%", height: "100%", paddingTop: `2em` }}>
        <Image
          src={DirectDebit}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
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
          className="transparent-btn"
          style={{ marginRight: `2em` }}
          onClick={handleCancel}
        >
          Cancel
        </div>
        <div className="blue-btn" onClick={handleDirectDebitSetup}>
          Click here to setup your direct debit
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 36 }}>
          Direct Debit Details
        </div>
        <ServeInfo />
        <div
          className="primary-title"
          style={{ fontSize: 20, paddingTop: `1em` }}
        >
          Please enter your direct debit details:
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr 1fr`,
            gap: `5px 20px`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr`,
              gridTemplateRows: `repeat(4, 70px)`,
              gap: `20px`,
              paddingTop: `1em`,
            }}
          >
            <div>
              <label className="required">Email</label>
              <input
                name="py3_email"
                value={formData.py3_email}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="First Name"
              />
              <FormError id="py3_email" />
            </div>
            <div>
              <label className="required">Account Name</label>
              <input
                name="core_name"
                value={formData.core_name}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Account Name"
              />
              <FormError id="core_name" />
            </div>
            <div>
              <label className="required">Account Number</label>
              <input
                name="core_accountnumber"
                value={formData.core_accountnumber}
                onChange={handleInputChange}
                type="number"
                className="form-control input"
                placeholder="Account Number"
              />
              <FormError id="core_accountnumber" />
            </div>
            <div>
              <label className="required">Sort Code</label>
              <input
                name="core_sortcode"
                value={formData.core_sortcode}
                onChange={handleInputChange}
                type="number"
                className="form-control input"
                placeholder="Sort Code"
              />
              <FormError id="core_sortcode" />
            </div>
          </div>
        </div>
        <ServeConditions />
        <ServeActions />
      </div>
      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Your payments are protected by the direct debit guarantee:
        </div>
        <ServeDirectDebitInfo />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DirectDebitPayment);
