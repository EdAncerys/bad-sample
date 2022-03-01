import Loading from "../components/loading";
const PaymentConfirmation = () => {
  setTimeout(() => {
    document.querySelector("#ask-to-close").removeAttribute("hidden");
    document.querySelector("#loading-o").setAttribute("hidden", true);
  }, 3000);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="https://badadmin.skylarkdev.co/wp-content/uploads/2022/02/BAD-Logo-2021-1.jpeg"
        alt="BAD Logo"
        style={{ width: "300px" }}
      />
      <h3>PAYMENT CONFIRMED</h3>
      <div id="loading-o">
        <Loading />
      </div>
      <div id="ask-to-close" hidden>
        You can close this modal now. Your payment has been accepted.
      </div>
    </div>
  );
};

export default PaymentConfirmation;
