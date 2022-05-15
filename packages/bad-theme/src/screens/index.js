import { connect, createContext } from "frontity";
import SSRProvider from "react-bootstrap/SSRProvider";
import { AppProvider } from "../context";
import { MediaProvider } from "../context/mediaQueryContext"; // media query context

import App from "./app";

const Root = () => {
  return (
    <AppProvider>
      <SSRProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </SSRProvider>
    </AppProvider>
  );
};

export default connect(Root);
