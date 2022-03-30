import { connect, Head } from "frontity";

const HTMLHead = ({ state }) => {
  return (
    <Head>
      <title>BAD</title>
      <meta
        name="British Association of Dermatologists (BAD)."
        content="Professional membership body for dermatologists in the UK and abroad."
      />
      <html lang="en" />
    </Head>
  );
};

export default connect(HTMLHead);
