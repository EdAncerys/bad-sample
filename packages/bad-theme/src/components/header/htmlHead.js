import { connect, Head } from "frontity";
import Logo from "../../img/svg/bad_logo_animate.svg";

const HTMLHead = ({ state }) => {
  return (
    <Head>
      <title>British Association of Dermatologists</title>
      <meta
        name="British Association of Dermatologists (BAD)."
        content="Professional membership body for dermatologists in the UK and abroad."
      />
      <html lang="en" />
      <link rel="shortcut icon" href={Logo}></link>
    </Head>
  );
};

export default connect(HTMLHead);
