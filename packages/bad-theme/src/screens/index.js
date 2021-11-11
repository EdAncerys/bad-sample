import { connect } from "frontity";
import { AppProvider } from "../context";
import SSRProvider from "react-bootstrap/SSRProvider";

import App from "./app";

const Root = () => {
  return (
    <AppProvider>
      <SSRProvider>
        <App />
      </SSRProvider>
    </AppProvider>
  );
};

export default connect(Root);
