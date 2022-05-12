import { connect, Head } from "frontity";
import Favicon from "../../img/svg/badFavicon.svg";

const HTMLHead = ({ state }) => {
  return (
    <Head>
      <title>British Association of Dermatologists</title>
      <meta
        name="British Association of Dermatologists (BAD)."
        content="Professional membership body for dermatologists in the UK and abroad."
      />
      <html lang="en" />
      <link rel="shortcut icon" href={Favicon}></link>
    </Head>
  );
};

export default connect(HTMLHead);
