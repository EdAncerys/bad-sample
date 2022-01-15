import { connect, createContext } from "frontity";
import SSRProvider from "react-bootstrap/SSRProvider";
import { AppProvider } from "../context";
import { MediaProvider } from "../context/mediaQueryContext"; // media query context
import { CookiesProvider } from "react-cookie";

import App from "./app";

const Root = () => {
  return (
    <CookiesProvider>
      <AppProvider>
        <SSRProvider>
          <MediaProvider>
            <App />
          </MediaProvider>
        </SSRProvider>
      </AppProvider>
    </CookiesProvider>
  );
};

export default connect(Root);
