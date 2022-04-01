import { connect } from "frontity";
import { useB2CLogin } from "../hooks/useB2CLogin";

const Codecollect = ({ state, actions, libraries }) => {
  console.log("🐞 B2C component triggered"); // debug

  return null;
};

const styles = {
  container: {},
};

export default connect(Codecollect);
