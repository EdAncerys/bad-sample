import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import PaymentModal from "./paymentModal";
import Loading from "../loading";
import TitleBlock from "../titleBlock";

// CONTEXT ---------------------------------------------
import { setErrorAction, authenticateAppAction } from "../../context";

import {
  useAppState,
  getApplicationStatus,
  useAppDispatch,
  muiQuery,
} from "../../context";
const Payments = ({ state, actions, libraries, subscriptions, dashboard }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { dynamicsApps, isActiveUser, refreshJWT } = useAppState();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [liveSubscriptions, setLiveSubscriptions] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  useEffect(() => {
    setLiveSubscriptions(dynamicsApps);
  }, []);

  // when should I return null ?
  if (!subscriptions) return null;
  if (
    dynamicsApps.subs.data.length === 0 &&
    dynamicsApps.apps.data.length === 0
  )
    return null;

  if (!liveSubscriptions) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = async ({
    core_membershipsubscriptionid,
    core_membershipapplicationid,
  }) => {
    const type = core_membershipsubscriptionid || core_membershipapplicationid;
    const sagepay_live =
      state.auth.ENVIRONMENT === "DEVELOPMENT" ? "test" : "live";
    const sagepayUrl = core_membershipsubscriptionid
      ? `/sagepay/${sagepay_live}/subscription/`
      : `/sagepay/${sagepay_live}/application/`;

    try {
      const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

      const fetchVendorId = await fetch(
        state.auth.APP_HOST +
          sagepayUrl +
          type +
          `?redirecturl=${state.auth.APP_URL}/payment-confirmation/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (fetchVendorId.ok) {
        const json = await fetchVendorId.json();
        console.log(json);
        const url =
          json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
        setPaymentUrl(url);
      }
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Something went wrong. Please try again.`,
          image: "Error",
        },
      });
    }
  };

  const resetPaymentUrl = async () => {
    setPaymentUrl(null);

    // update application status for the user
    if (isActiveUser)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });
  };

  // SERVERS ---------------------------------------------
  const ServePayments = ({ block, item, type }) => {
    if (dashboard && block.bad_sagepayid !== null) return null;

    const { core_totalamount, core_name } = block;

    const ServeStatusOrAction = () => {
      // get important data
      const {
        bad_outstandingpayments,
        core_membershipsubscriptionid,
        core_membershipapplicationid,
        bad_sagepayid,
      } = block;

      const ServePayButton = () => {
        if (bad_sagepayid || core_totalamount === "£0.00") return null;

        return (
          <div
            className="blue-btn"
            onClick={() =>
              handlePayment({
                core_membershipsubscriptionid,
                core_membershipapplicationid,
              })
            }
          >
            Pay now
          </div>
        );
      };

      const ServePaymentStatus = () => {
        if (!bad_sagepayid) return null;
        if (lg && bad_sagepayid) return "Status: paid";
        if (bad_sagepayid) return "Paid";
      };

      return (
        <div
          style={{
            margin: `auto 0`,
            width: !lg ? marginHorizontal * 2 : "auto",
          }}
        >
          <div style={{ padding: !lg ? `0 2em` : 0 }}>
            <ServePayButton />
            <ServePaymentStatus />
          </div>
        </div>
      );
    };

    const ServeInfo = () => {
      if (!liveSubscriptions) return null;
      // 📌 bottom border show for the block if it's the last one
      // check how many outstanding app payments there are
      let paymentLength = liveSubscriptions.apps.data.length;
      if (type === "subscriptions")
        paymentLength = liveSubscriptions.subs.data.length;
      const isLastItem = paymentLength === item + 1;
      console.log("🐞 ", liveSubscriptions);
      console.log("🐞 item", item);

      return (
        <div
          className={!lg ? "flex" : "flex-col"}
          style={{
            borderBottom: !isLastItem
              ? `1px solid ${colors.darkSilver}`
              : "none",
            padding: !lg ? `1em` : 0,
            paddingTop: !lg ? null : "1em",
          }}
        >
          <div className="flex" style={styles.fontSize}>
            <div>{core_name}</div>
          </div>
          <div className="flex" style={styles.fontSize}>
            <div>{core_totalamount}</div>
          </div>
        </div>
      );
    };

    return (
      <div className={!lg ? "flex-row" : "flex-col"}>
        <ServeInfo />
        <ServeStatusOrAction />
      </div>
    );
  };

  const ServeSubTitle = ({ title }) => {
    return <div style={{ padding: `1em 0` }}>{title}</div>;
  };

  const ServeListOfPayments = ({ type }) => {
    const zeroObjects =
      type === "applications"
        ? liveSubscriptions.apps.data.length === 0
        : liveSubscriptions.subs.data.length === 0;
    const appsOrSubs = type === "applications" ? "apps" : "subs";

    return (
      <div>
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            padding: !lg ? "2em 0" : 0,
            marginTop: !lg ? null : "1em",
          }}
        >
          {dashboard ? "Outstanding payments" : `Active ${type}:`}
        </div>
        {zeroObjects && <ServeSubTitle title="No active subscriptions found" />}

        {liveSubscriptions[appsOrSubs].data.map((block, key) => {
          return (
            <ServePayments key={key} block={block} item={key} type={type} />
          );
        })}
      </div>
    );
  };

  return (
    <div className="shadow">
      {dashboard && (
        <div style={{ padding: !lg ? `2em 4em` : `1em` }}>
          <TitleBlock
            block={{ text_align: "left", title: "Payments" }}
            disableMargin
          />
        </div>
      )}
      <div
        style={{
          padding: !lg ? `0 4em 2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <PaymentModal
          payment_url={paymentUrl}
          resetPaymentUrl={resetPaymentUrl}
        />

        {!dashboard && <ServeListOfPayments type="applications" />}
        <ServeListOfPayments type="subscriptions" />
      </div>
    </div>
  );
};

const styles = {
  text: {
    fontSize: 12,
  },
};

export default connect(Payments);
