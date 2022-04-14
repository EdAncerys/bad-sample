import { useState, useEffect } from "react";
import { connect } from "frontity";

import { v4 as uuidv4 } from "uuid";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

function blankForm() {
  return {
    Amount: "10.00",
    VPSProtocol: "3.00",
    TxType: "PAYMENT",
    Vendor: "dermatologist",
    VendorTxCode: uuidv4(),
    Currency: "GBP",
    Description: "<B>BAD</B>Membership Subscription Purchase",
    NotificationURL: "https://skylarkdev.digital/moneyhub/sagepay",
    BillingSurname: "Cullen",
    BillingFirstnames: "Chris",
    BillingAddress1: "166 Anchor Road",
    BillingAddress2: "Longton",
    BillingCity: "Stoke on Trent",
    BillingPostCode: "ST3 5EN",
    BillingCountry: "GB",
    DeliverySurname: "Cullen",
    DeliveryFirstnames: "Chris",
    DeliveryAddress1: "166 Anchor Road",
    DeliveryAddress2: "Longton",
    DeliveryCity: "Stoke on Trent",
    DeliveryPostCode: "ST3 5EN",
    DeliveryCountry: "GB",
  };
}

const Sagepay = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { jwt } = useAppState();

  const [formData, setFormData] = useState(blankForm());
  const [sage, setSage] = useState(null);
  const [hasUrl, setHasUrl] = useState(false);

  // let scope = jwt.decode.scope || "none";
  let scope = "admin"; // test var
  let inScope = ["admin", "sage"].includes(scope);
  function updateForm(e) {
    const newData = { ...formData };
    newData[e.target.name] = e.target.value;
    setFormData(newData);
  }

  async function doSage(e) {
    try {
      const request = {
        // url: 'https://ae6d-82-31-1-88.ngrok.io/sagepay/test',
        url: "https://skylarkdev.digital/dynamicsbridge/sagepay/test",
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sage: { ...formData } }),
      };
      e.preventDefault();

      console.log("About to sage");
      let sage = await fetch(request.url, request);
      console.log("Sage OK = ", sage.ok);
      if (sage.ok) {
        sage = await sage.json();
        let sageResult = sage.data.split("\r\n");
        sageResult = sageResult.reduce((a, i) => {
          i = i.split("=");
          a[i[0]] = i[1];
          return a;
        }, {});
        setSage(sageResult);
        setHasUrl(true);
      }
    } catch (error) {
      console.error("doSage -> General error ", error);
    }
  }

  if (!inScope) {
    return (
      <div className="row">
        <div className="col-md-3 offset-md-5">
          <h1 className="text-center">Disabled</h1>
          <p className="text-center">
            This page is currently disabled (your user may not have permission
            to view)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow">
      <div style={{ display: hasUrl ? "none" : "auto" }}>
        <h2 className="text-center"> Submmit Payment to SagePay</h2>
        <form onSubmit={doSage}>
          <div className="form-group row">
            <label className="col-md-1 col-form-label">Amount</label>
            <div className="col-lg-1 col-md-2">
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.Amount}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">VPSProtocol</label>
            <div className="col-lg-1 col-md-2">
              <input
                type="number"
                className="form-control"
                name="VPSProtocol"
                value={formData.VPSProtocol}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">TxType</label>
            <div className="col-lg-1 col-md-2">
              <input
                type="text"
                className="form-control"
                name="TxType"
                value={formData.TxType}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">Vendor</label>
            <div className="col-lg-1 col-md-3">
              <input
                type="text"
                className="form-control"
                name="Vendor"
                value={formData.Vendor}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-1 col-form-label">VendorTxCode</label>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="VendorTxCode"
                value={formData.VendorTxCode}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">Description</label>
            <div className="col-lg-3">
              <input
                type="text"
                className="form-control"
                name="Description"
                value={formData.Description}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-1 col-form-label">NotificationURL</label>
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                name="NotificationURL"
                value={formData.NotificationURL}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-5 offset-md-4 col-form-label">
              Billing and Delivery Information
            </label>
          </div>

          <div className="form-group row">
            <label className="col-md-1 col-form-label">Firstname</label>
            <div className="col-lg-1">
              <input
                type="text"
                className="form-control"
                name="BillingFirstnames"
                value={formData.BillingFirstnames}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">Surname</label>
            <div className="col-lg-1">
              <input
                type="text"
                className="form-control"
                name="BillingSurname"
                value={formData.BillingSurname}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-1 col-form-label">Address 1</label>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="BillingAddress1"
                value={formData.BillingAddress1}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">Address 2</label>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="BillingAddress2"
                value={formData.BillingAddress2}
                onChange={updateForm}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-md-1 col-form-label">City</label>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="BillingCity"
                value={formData.BillingCity}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">PostCode</label>
            <div className="col-md-1">
              <input
                type="text"
                className="form-control"
                name="BillingPostCode"
                value={formData.BillingPostCode}
                onChange={updateForm}
              />
            </div>
            <label className="col-md-1 col-form-label">Country</label>
            <div className="col-md-1">
              <input
                type="text"
                className="form-control"
                name="BillingCountry"
                value={formData.BillingCountry}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-sm-10">
              <div className="btn-primary">Send To Sage</div>
            </div>
          </div>
        </form>
      </div>
      <div style={{ display: hasUrl ? "inherit" : "none" }}>
        <h2 className="text-center"> Sage Payment</h2>
        <div className="row">
          <div className="col-md-3">
            <h4>This is what the API server gave us back.</h4>
            <p className="row pt-2 pb-2">
              We need to combine the NextURL with the VPSTxId by adding = and
              the VPSTxId value. That is what happens here before I set it as
              the iFrame src
            </p>
            <pre>{JSON.stringify(sage, null, 2)}</pre>
          </div>
          <div className="col-md-9">
            <iframe
              width="100%"
              height="700"
              src={hasUrl ? sage.NextURL + "=" + sage.VPSTxId : ""}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Sagepay);
