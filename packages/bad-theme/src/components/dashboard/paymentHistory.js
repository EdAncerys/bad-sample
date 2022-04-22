import { connect } from "frontity";
import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { getInvoiceAction, useAppState, useAppDispatch } from "../../context";

const ServePayments = ({
  state,
  actions,
  block,
  subAppHistory,
  item,
  setFetching,
}) => {
  if (!block) return null;

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const isLastItem = subAppHistory.length === item + 1; // item length helper
  const isFirst = item === 0; // item length helper
  const { core_name, core_totalamount, core_endon, bad_sagepayid } = block; // get block props
  // for core_endon date string & reverse month and day
  const [month, day, year] = core_endon.split("/");
  // EU format year
  const date = `${month}/${day}/${year}`;
  // ⬇️ if !bad_sagepayid then dont display entry
  if (!bad_sagepayid) return null;

  // HELPERS ----------------------------------------------------------------
  const handleDownloadPayment = async () => {
    try {
      setFetching(true);
      const url = await getInvoiceAction({
        state,
        isActiveUser,
        dispatch,
        refreshJWT,
      });
      // await for link to download & open in new window to download
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeDownloadAction = ({ currentPayYear, isFirst }) => {
    if (!isFirst) return null;
    // if currentPayYear is not current year, return null
    // get current year from date
    const currentYear = new Date().getFullYear();
    if (Number(currentPayYear) !== currentYear) return null;

    return (
      <div className="flex" style={{ padding: "1em 0" }}>
        <div className="flex" style={{ display: "grid", alignItems: "center" }}>
          {currentPayYear}
        </div>
        <div style={{ alignItems: "center" }}>
          <div className="blue-btn" onClick={handleDownloadPayment}>
            Download Receipt
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeDownloadAction currentPayYear={year} isFirst={isFirst} />
      <div
        className="flex"
        style={{
          borderBottom: isLastItem ? "none" : `1px solid ${colors.darkSilver}`,
          padding: `1em`,
          marginRight: marginHorizontal * 2,
        }}
      >
        <div className="flex" style={styles.textInfo}>
          <div>{core_name}</div>
        </div>
        <div className="flex" style={styles.textInfo}>
          <div>{core_endon}</div>
        </div>
        <div className="flex" style={styles.textInfo}>
          <div>{core_totalamount}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "0.5em 0",
  },
};

export default connect(ServePayments);
