import { connect } from "frontity";
import { AppProvider } from "../context";
import App from "./app";

const Root = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default connect(Root);
