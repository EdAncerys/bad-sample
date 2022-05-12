import PaymentNotification from "./paymentNotification";

const ApplicationStatusOrPayment = ({ application }) => {
  if (!application) return null;
  if (!application.bad_approvalstatus) return null;
  if (application.bad_sagepayid) return null;

  if (application.bad_approvalstatus === "Approved") {
    return (
      <div className="shadow">
        <PaymentNotification application={application} />
      </div>
    );
  }

  return null;
};

export default ApplicationStatusOrPayment;
