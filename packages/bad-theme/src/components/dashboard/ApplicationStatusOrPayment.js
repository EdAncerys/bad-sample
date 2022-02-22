import PaymentNotification from "./paymentNotification";
const ApplicationStatusOrPayment = ({ userStatus }) => {
  if (!userStatus) return null;
  const { apps, subs } = userStatus;
  if (subs.data.length > 0) return null;
  if (apps.data.length === 0) return null;

  if (apps.data[0].bad_sagepayid) return null;

  if (
    apps.data[0].bad_approvalstatus === "Approved" &&
    !apps.data[0].bad_sagepayid
  ) {
    return (
      <div className="shadow">
        <PaymentNotification application={apps.data[0]} />
      </div>
    );
  }

  if (apps.data[0].bad_approvalstatus === "Pending") {
    return (
      <div className="shadow" style={{ padding: 30 }}>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Your application has been sent and is pending approval.
        </div>
      </div>
    );
  }

  return null;
};

export default ApplicationStatusOrPayment;
