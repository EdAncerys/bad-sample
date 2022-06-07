import { connect } from "frontity";
// --------------------------------------------------------------------------------
import Loading from "../components/loading";

const Codecollect = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌 B2C codecollect redirect handler page
  // --------------------------------------------------------------------------------
  // console.log("🐞 B2C component triggered"); // debug

  return <Loading />;
};

const styles = {
  container: {},
};

export default connect(Codecollect);
