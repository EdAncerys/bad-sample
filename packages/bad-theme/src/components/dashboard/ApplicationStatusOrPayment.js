import PaymentNotification from "./paymentNotification";
const ApplicationStatusOrPayment = ({ application }) => {
  if (!application) return null;
  if (!application.bad_approvalstatus) return null;
  if (application.bad_sagepayid) return null;
  // const { apps, subs } = userStatus;
  // console.log("APPS", apps);
  // if (subs.data.length > 0 || apps.data.length === 0) return null;

  if (application.bad_approvalstatus === "Approved") {
    return (
      <div className="shadow">
        <PaymentNotification application={application} />
      </div>
    );
  }

  // if (application.bad_approvalstatus === "Pending") {
  //   return (
  //     <div className="shadow" style={{ padding: 30 }}>
  //       <div className="primary-title" style={{ fontSize: 20 }}>
  //         Your application for {application.core_name} has been sent and is
  //         pending approval.
  //       </div>
  //     </div>
  //   );
  // }

  return null;
};

export default ApplicationStatusOrPayment;
